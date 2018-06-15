
const config  = require("../../config/config.js");

const _ = require("lodash");

const elastic = require("elasticsearch");
const elasticClient = new elastic.Client({
    "apiVersion": config.elasticsearch.version || "2.4",
    "host": [
        {
            "host": config.elasticsearch.host || "localhost",
            "auth": config.elasticsearch.auth || ""
        }
    ],
    // Only wait for 5 seconds
    "requestTimeout": 5000
});


const FIELDS = ["cui", "str", "pref"];


module.exports = function *() {
    var body    = this.request.body;
    var query   = _.deburr(body.query);


    // var queryObj = {};

    // queryObj["index"] = "autocomplete";
    // queryObj["body"] =  {
    //     "_source": FIELDS,
    //     "size": 14,

    //     "query": {
    //         "bool" : {
    //             "must": [
    //                 {
    //                     "match_phrase" : {
    //                         "str": query.trim()
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // };

    // elasticClient.suggest(
    //     {
    //         "index": "autocomplete",
    //         "body": {
    //             "text": query.trim(),

    //                 "sug1": {
    //                     "term": {
    //                         "field": "str"
    //                     }
    //                 },

    //                 "sug2": {
    //                     "term": {
    //                         "field": "str.suggest"
    //                     }
    //                 },

    //                 "sug3": {
    //                     "term": {
    //                         "field": "str.exact"
    //                     }
    //                 }
    //         }
    //     },
    //     function (error, response) {
    //         console.log(error);

    //         // if (response && response.hits) {
    //             console.log(JSON.stringify(response, null, 4));
    //         // }
    //     });

    var respo = yield autocompletion(query);


    this.body = respo;

    // // Search for suggestions in Elasticsearch
    // var exactMatches = yield findExact(query);
    // var exactHits = [];

    // // Filter exact hits for uniqueness
    // if (exactMatches.hits.length) {
    //     exactHits =  _.uniqBy(exactMatches.hits, s => s["pref"].trim().replace("-", " ").toLowerCase());
    // }


    // // If no matches -> attempt spelling fixes
    // var closeMatches = yield findMatches(query);
    // var misspelledMatches = { "hits": [] };

    // if (!closeMatches.hits.length || (query.length > 4 && closeMatches.hits.length < 4)) {
    //     misspelledMatches = yield spellingMatches(query);
    // }

    // // Combine suggestions
    // var allMatches = [].concat(exactHits, closeMatches.hits, misspelledMatches.hits);

    // // Also check for common appendixes (STADIUM, STAGE, etc.)
    // var just_str = allMatches.map(s => s["str"].toLowerCase());
    // var unique = generateTerms(allMatches, just_str);


    // this.body = {
    //     "took" : (exactMatches.took || 10) + (closeMatches.took || 20),
    //     "hits" : reducePayload(unique)
    // };
};


function autocompletion(query="") {
    var queryObj = {};

    queryObj["index"] = "autocomplete";
    queryObj["body"] =  {
        "_source": FIELDS,
        "size": 15,
        "query": {
            "match" : {
                "str" : {
                    "query" : query.toLowerCase().trim(),
                    // "fuzziness": "AUTO",
                    "operator" : "AND",
                    "prefix_length"   : 2,
                    "max_expansions"  : 10
                }
            }
        }
    };

    return getResults(queryObj);
}


function getResults (queryObj) {
    return function(callback) {
        elasticClient.search(queryObj, function(err, res) {
            if (err) {
                return callback(false, { "error": true, "took": 10, "hits": []});
            }

            var hits = res.hits;
            var result = [];

            if (hits && hits.total > 0) {
                result = hits.hits.map(function(hit) {
                    return hit["_source"];
                });
            }

            callback(err, {
                "took": res.took,
                "hits": result,
            });
        });
    };
}
