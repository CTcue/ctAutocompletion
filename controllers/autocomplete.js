
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

const source = ["cui", "str", "pref"];

module.exports = function *() {
    const start = Date.now();
    const body = this.request.body;

    // Limit to N characters input;
    const clean = _.deburr(body.query)
        .trim()
        .slice(0, 42)
        .trim();

    if (!clean) {
        this.body = {
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

    const matchQuery = {
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

    const results = yield getResults(matchQuery);
    const allMatches = results.hits || [];

    // Search allowing spelling mistakes (CPU intensive)
    if (!allMatches.length || allMatches.length < 4) {
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

        const results = yield getResults(fuzzyQuery);
        const spellingMatches = results.hits || [];

        this.body = {
            "took": Math.ceil(Date.now() - start),
            "hits" : reducePayload(allMatches.concat(spellingMatches))
        };
    }
    else {
        this.body = {
            "took": Math.ceil(Date.now() - start),
            "hits" : reducePayload(allMatches)
        };
    }
};

// Groups by CUI and strips "pref" if it"s exactly the same as str
function reducePayload(hits) {
    const result = [];
    const grouped = _.groupBy(hits, "cui");

    for (var cui in grouped) {
        var tmp = grouped[cui][0];

        if (grouped[cui].length > 1) {
            tmp.pref = _.uniqBy(grouped[cui].map(s => s["pref"].trim().replace("-", " ").toLowerCase())).join(", ");

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

function getResults (queryObj) {
    return function(callback) {
        elasticClient.search(queryObj, function(err, esRes) {
            if (err) {
                if (err.meta && err.meta.body) {
                    console.error(JSON.stringify(err.meta.body, null, 2));
                }

                return callback(false, { "error": true, "took": 10, "hits": []})
            }

            const res = esRes.body;
            const hits = res.hits;

            let result = [];

            if (hits && hits.total.value > 0) {
                result = hits.hits.map(function(hit) {
                    return {
                        ...hit["_source"],
                        score: hit._score
                    }
                });
            }

            callback(err, {
                "took": res.took,
                "hits": result,
            });
        });
    }
}
