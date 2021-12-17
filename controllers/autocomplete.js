
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

const source = ["cui", "str", "pref"];

module.exports = function *() {
    var body = this.request.body;
    var query = _.deburr(body.query);

    // Search for suggestions in Elasticsearch
    var exactMatches = yield findExact(query);
    var exactHits = [];

    // Filter exact hits for uniqueness
    if (exactMatches.hits.length) {
        exactHits =  _.uniqBy(exactMatches.hits, s => s["pref"].trim().replace("-", " ").toLowerCase());
    }

    // If no matches -> attempt spelling fixes
    var closeMatches = yield findMatches(query);
    var misspelledMatches = { "hits": [] };

    if (!closeMatches.hits.length || (query.length > 4 && closeMatches.hits.length < 4)) {
        misspelledMatches = yield spellingMatches(query);
    }

    // Combine suggestions
    var allMatches = [].concat(exactHits, closeMatches.hits, misspelledMatches.hits);

    // Also check for common appendixes (STADIUM, STAGE, etc.)
    var just_str = allMatches.map(s => s["str"].toLowerCase());
    var unique = generateTerms(allMatches, just_str);


    this.body = {
        "took" : (exactMatches.took || 10) + (closeMatches.took || 20),
        "hits" : reducePayload(unique)
    };
};

// Groups by CUI and strips "pref" if it"s exactly the same as str
function reducePayload(terms) {
    var result = [];
    var grouped = _.groupBy(terms, "cui");

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

function findExact(query) {
    // Exact term is indexed without dashes
    var wantedTerm = string.removeDashes(query);

    var queryObj = {
        "index": "autocomplete",
        "size" : 4,
        "body": {
            "_source": source,
            "query": {
                "term" : {
                    "exact" : wantedTerm
                }
            }
        }
    };

    return getResults(queryObj);
}

function findMatches(query) {
    var queryObj = {};
    queryObj["index"] = "autocomplete";
    queryObj["body"] =  {
        "_source": source,
        "size": 14,
        "query": {
            "bool" : {
                "must": [
                    {
                        "match_phrase" : {
                            "str" : query.trim()
                        }
                    }
                ]
            }
        }
    };

    return getResults(queryObj);
}

function spellingMatches(query) {
    var queryObj = {};
    queryObj["index"] = "autocomplete";
    queryObj["body"] =  {
        "_source": source,
        "size": 5,
        "query": {
            "match" : {
                "str" : {
                    "query" : query.trim(),
                    "fuzziness": "AUTO",
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
        elasticClient.search(queryObj, function(err, esRes) {
            if (err) {
                console.error("[ERROR elastic]", err);
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
