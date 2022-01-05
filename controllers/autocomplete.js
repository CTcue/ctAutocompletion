
/**
 * Usage
 *   curl -X POST -H "Content-Type: application/json" -d '{"query": "myo inf"}' http://localhost:4080/v2/autocomplete
 */

const _ = require("lodash");
const config = require("../config/config");
const string = require("../lib/string");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

const source = ["cui", "str", "pref", "source", "lang", "types"];

module.exports = function *() {
    const start = Date.now();
    const body = this.request.body;

    // Limit to N characters input;
    const clean = _.deburr(body.query).trim().slice(0, 42);

    if (!clean) {
        this.body = {
            "took": Math.ceil(Date.now() - start),
            "hits": []
        };

        return;
    }

    // Exact term is indexed without dashes
    const exactSearch = clean
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const matchQuery = {
        "index": config.elasticsearch.index,
        "size" : 24,
        "sort": ["_score"],

        // "explain": true,

        "body": {
            "_source": { "includes": source },

            "query": {
                "function_score" : {
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "term" : {
                                        "exact": {
                                            "value": exactSearch
                                        }
                                    }
                                },

                                {
                                    "match_phrase": {
                                        "str": {
                                            "query": clean
                                        }
                                    }
                                },

                                // {
                                //     "match" : {
                                //         "str": {
                                //             "query": clean,
                                //             "fuzziness": "AUTO",
                                //             "operator": "AND",
                                //             "prefix_length": 2,
                                //             "max_expansions": 10
                                //         }
                                //     }
                                // }
                            ]
                        }
                    },

                    // "boost": 5,
                    "boost_mode": "sum",
                    // "score_mode": "max",

                    "functions": [
                        {
                            "filter": {
                                "exists": {
                                    "field": "pref"
                                }
                            },
                            "weight": 1
                        },

                        // {
                        //     "filter": {
                        //         "terms": {
                        //             "source": ["ICD10", "ICD10DUT"]
                        //         }
                        //     },
                        //     "weight": 3
                        // },

                        // {
                        //     "filter": {
                        //         "terms": {
                        //             "source": ["MSHDUT", "MDRDUT"]
                        //         }
                        //     },
                        //     "weight": 2
                        // },

                        // {
                        //     "filter": {
                        //         "terms": {
                        //             "source": ["SNOMEDCT_US"]
                        //         }
                        //     },
                        //     "weight": 2
                        // },

                        // {
                        //     "filter": {
                        //         "terms": {
                        //             "types": [
                        //                 "DISO"
                        //             ]
                        //         }
                        //     },
                        //     "weight": 3
                        // }
                    ]
                }
            }
        }
    };

    const results = yield getResults(matchQuery);
    const allMatches = results.hits || [];

    // console.log("=====")
    // console.log("INPUT", clean)
    // for (const m of allMatches) {
    //     console.log(m)
    // }

    this.body = {
        "took": Math.ceil(Date.now() - start),
        "hits" : reducePayload(allMatches)
    };
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

            // console.log(JSON.stringify(res, null, 4))

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
