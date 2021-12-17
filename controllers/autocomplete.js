
/** Usage

    curl -X POST -H "Content-Type: application/json" -d "{
        "query": "myo inf"
    }" "http://localhost:4080/v2/autocomplete"

*/

const _ = require("lodash");
const config = require("../config/config");
const string = require("../lib/string");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

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

    const matchQuery = {
        "index": config.elasticsearch.index,
        "size" : 20,

        "body": {
            "_source": { "includes": ["cui", "str", "pref"] },

            "query": {
                "bool": {
                    "should": [
                        {
                            "term" : {
                                "exact": {
                                    "value": clean.toLowerCase(),
                                    "boost": 5
                                }
                            }
                        },

                        // {
                        //     "match_phrase": {
                        //         "str": {
                        //             "query": clean
                        //         }
                        //     }
                        // },

                        // {
                        //     "exists": {
                        //         "field": "pref"
                        //     }
                        // }

                        // {
                        //     "match_phrase": {
                        //         "pref": {
                        //             "query": clean,
                        //             "slop": 2
                        //         }
                        //     }
                        // },

                        {
                            "match" : {
                                "str": {
                                    "query" : clean,
                                    "operator" : "AND",
                                    // "fuzziness": 3,
                                    // "prefix_length": 2,
                                    // "max_expansions": 30
                                }
                            }
                        }
                    ]
                }
            }
        }
    };

    const results = yield getResults(matchQuery);
    const allMatches = results.hits || [];

    // const just_str = allMatches.map(s => s["str"].toLowerCase());
    // const unique = generateTerms(allMatches, just_str);

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
                    console.error(err.meta.body);
                }

                return callback(false, { "error": true, "took": 10, "hits": []})
            }

            var res = esRes.body;
            var hits = res.hits;
            var result = [];

            if (hits && hits.total.value > 0) {
                result = hits.hits.map(function(hit) {
                    return hit["_source"];
                });
            }

            callback(err, {
                "took": res.took,
                "hits": result,
            });
        });
    }
}

// Add custom terms if there is a certain pattern:
// - Gleason score 5
// - Diabetes mellitus type 2
// - Diabetes mellitus type II
// - etc.
function generateTerms(unique, strings) {
    var generated = _.map(strings, string.replaceAppendix);

    var to_add = _.uniq(_.filter(generated, function(s) {
        return !_.includes(strings, s);
    }));


    var added = [];
    for (var i=0; i < to_add.length; i++) {
        added.push({
            "str"      : to_add[i],
            "pref"     : "",
            "cui"      : "generated",
        });
    }

    return [].concat(added, unique);
}
