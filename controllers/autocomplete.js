"use strict";

/** Usage

    curl -X POST -H "Content-Type: application/json" -d '{
        "query": "cabg"
    }' "http://localhost:4080/autocomplete"

*/

var config  = require('../config/config.js');

var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


var guess_origin = require("./lib/guess_origin");
var Trie = require('./lib/trie');
var _ = require("lodash");


const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
    }
  ]
});


const source = ["cui", "str", "pref", "types"];


module.exports = function *() {
    var headers = this.req.headers;

    // Remove diacritics from query
    var query = _.deburr(this.request.body.query);
    var query_type = guess_origin(query);

    // Lookup matches in Elasticsearch
    var exactMatches = yield findExact(query, query_type);

    var likes = [];
    var specialMatches = [];
    var closeMatches   = {"hits": []};

    // Default query_type
    // Check special matches, such as demographic options
    if (query_type === "default") {
        closeMatches = yield findMatches(query);
        specialMatches = yield findSpecial(query);

        // Find user added contributions (if needed)
        if (config.neo4j["is_active"] && this.user) {
            likes = yield findUserLikes(query, this.user._id, this.user.env);
        }
    }

    var allMatches = [].concat(exactMatches.hits, likes, closeMatches.hits);
    var unique     = _.uniq(allMatches, s => s["cui"]);

    this.body = {
        "took"   : (exactMatches.took || 10) + (closeMatches.took || 20),
        "special": specialMatches,
        "hits"   : unique
    };
};


function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


function findUserLikes(query, userId, environment) {
        // For now, only get the "Dislikes" to uncheck stuff
    return function(callback) {

        var cypherObj = {
            "query": `MATCH
                        (s:Synonym)<-[r:LIKES]-(u:User { id: { _USER_ }, env: { _ENV_ } })
                      WHERE
                        s.str =~ {_QUERY_}
                      RETURN
                        s.str as str, s.label as label, s.cui as cui`,

            "params": {
              "_USER_": userId,
              "_ENV_" : environment,
              "_QUERY_": "(?i)" + escapeRegExp(query) + ".*"
            },

            "lean": true
        }

        db.cypher(cypherObj, function(err, res) {
            if (err) {
                console.log(err);
                callback(false, []);
            }
            else {
                var result = res.map(function(s) {
                    // For display / uniqueness test
                    s["pref"]  = s["str"];
                    s["exact"] = s["str"];
                    s["contributed"] = true;

                    return s;
                })

                callback(false, result);
            }
        });
    }
}

function findExact(query, query_type) {
    var queryObj = {};

    //
    // TODO: DBC lookup?
    //


    if (query_type === "cui") {
        queryObj["body"] = {
            "_source": source,
            "size": 4,
            "query": {
                "term" : {
                    "cui" : query
                }
            }
        };

        queryObj["index"] = "autocomplete";
    }
    else {
        // Exact term is indexed without dashes
        var wantedTerm = query
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

        queryObj["body"] = {
            "_source": source,
            "size": 3,
            "query": {
                "term" : {
                    "exact" : wantedTerm
                }
            }
        };

        queryObj["index"] = "autocomplete";
    }

    // console.log(JSON.stringify(queryObj, null, 2))

    return getResults(queryObj);
}


function findMatches(query) {
    var queryObj = {};

    queryObj["index"] = "autocomplete";
    queryObj["body"] =  {
        "_source": source,
        "size": 6,
        "query": {
            "function_score" : {
                "query" : {
                    "match_phrase" : {
                        "str" : query.trim()
                    }
                },
                // Boost disease/disorders category
                "functions" : [
                    {
                        "filter": {
                            "terms": { "types": ["DISO", "PROC", "T200"] }
                        },
                        "weight": 1.5
                    }
                ]
            }
        }
    };

    return getResults(queryObj);
}


function getResults (queryObj) {
    return function(callback) {
        elasticClient.search(queryObj, function(err, res) {
            if (err) {
                return callback(false, { "error": true, "took": 10, "hits": []})
            }

            var hits = res.hits;
            var result = [];

            if (hits && hits.total > 0) {
                for (var i=0; i < hits.hits.length; i++) {
                    result.push(hits.hits[i]._source);
                }
            }

            callback(err, {
                "took": res.took,
                "hits": _.sortBy(result, (t => t.str.length)),
            });
        });
    }
}




// Build regex objects for custom category checks
var TRIE = new Trie(config.demographic_types.mapping);
var LOOKUP = config.demographic_types.lookup;

function findSpecial(query) {
    var _query = query.trim().toLowerCase();

    return function(callback) {
        var result = false;
        var match = TRIE.search(_query);

        // Return first/best match if available
        if (match.length > 0) {
            var best = match[0];

            // Get category info from LOOKUP
            if (LOOKUP.hasOwnProperty(best.value)) {
                result = LOOKUP[best.value];

                result["use_template"] = true;
                result["cui"] = "custom";
                result["str"] = best.key;
            }
        }

        callback(false, result);
    }
}
