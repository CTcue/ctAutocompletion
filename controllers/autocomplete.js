
/**
 * Usage
 *   curl -X POST -H "Content-Type: application/json" -d '{"query": "myo inf"}' http://localhost:4080/v2/autocomplete
 */

const _ = require("lodash");
const config = require("../config/config");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

const source = ["cui", "str", "pref", "label"];

module.exports = async function(ctx) {
    const start = Date.now();
    const body = ctx.request.body;

    // Limit to N characters input;
    const clean = _.deburr(String(body.query))
        .trim()
        .slice(0, 42)
        .trim();

    if (!clean) {
        ctx.body = {
            "took": Math.ceil(Date.now() - start),
            "hits": []
        };

        return;
    }

    // The `exact` term is indexed without dashes
    const exactSearch = clean
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const query = {
        "index": config.elasticsearch.index,
        "size" : config.autocomplete.size || 20,
        "sort": ["_score"],
        "body": {
            "_source": { "includes": source },
            "query": {
                "bool": {
                    "must": [
                        {
                            "match_phrase": {
                                "str": {
                                    "query": clean
                                }
                            }
                        }
                    ],

                    "should": [
                        {
                            "term" : {
                                "exact": {
                                    "value": exactSearch,
                                    "boost": 10
                                }
                            }
                        },

                        // Boost terms that start with what the user typed
                        {
                            "prefix" : {
                                "exact": {
                                    "value": _.first(exactSearch.split(" ")) || ""
                                }
                            }
                        },

                        {
                            "terms": {
                                "types": ["DISO"],
                                "boost": 0.5
                            }
                        },

                        {
                            "terms": {
                                "types": ["PROC", "PHYS"],
                                "boost": 0.1
                            }
                        }
                    ]
                }
            }
        }
    };

    const response = await elasticClient.search(query);
    const hits = getResponseSources(response.body || {});

    // Search allowing spelling mistakes (CPU intensive)
    if (!hits.length || hits.length < 4) {
        const fuzzyQuery = {
            "index": config.elasticsearch.index,
            "size" : 5,
            "sort": ["_score"],

            "body": {
                "_source": { "includes": source },

                "query": {
                    "match" : {
                        "str": {
                            "query": clean,
                            "fuzziness": "AUTO",
                            "operator": "AND",
                            "prefix_length": 2,
                            "max_expansions": 10
                        }
                    }
                }

            }
        };

        const responseFuzzy = await elasticClient.search(fuzzyQuery);
        const fuzzy = getResponseSources(responseFuzzy.body || {});

        hits.push(...fuzzy);
    }

    ctx.body = {
        took: Math.ceil(Date.now() - start),
        hits: reducePayload(hits)
    };
};

function getResponseSources(response = {}) {
    return _.get(response, "hits.hits", []).map(r => {
        return _.get(r, "_source", {});
    });
}

// Groups by CUI and strips 'pref' if it's exactly the same as str
const uniqueFn = (s) => s["pref"].trim().replace("-", " ").toLowerCase();

function reducePayload(hits = []) {
    const result = [];
    const grouped = _.groupBy(hits, "cui");


    for (const cui in grouped) {
        const tmp = grouped[cui][0];

        if (grouped[cui].length > 1) {
            const mapped = grouped[cui].map(uniqueFn);
            tmp.pref = _.uniqBy(mapped).join(", ");
            result.push(tmp)
        }
        else {
            if (tmp.str.toLowerCase() === tmp.pref.toLowerCase()) {
                tmp["pref"] = "";
            }

            result.push(tmp)
        }
    }

    return result;
}
