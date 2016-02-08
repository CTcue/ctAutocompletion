
/** Module dependencies. */

var config  = require('../config/config.js');

var guess_origin = require("./lib/guess_origin");
var _ = require("lodash");

var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});


const source = ["cui", "str", "exact", "pref", "source", "types"];

// Build regex objects for demographic check
var DEMOGRAPHICS = [];
for (var k in config.demographic_types) {
    DEMOGRAPHICS.push({
        "exp"  : new RegExp("^" + k.toLowerCase()),
        "type" : config.demographic_types[k]
    })
}

module.exports = function *() {
  var query = this.request.body.query;

  // Check special matches, such as demographic options
  var specialMatches = yield findSpecial(query);

  // Lookup matches in Elasticsearch
  var exactMatches = yield findExact(query);
  var closeMatches = yield findMatches(query);

  this.body = {
    "took": exactMatches.took + closeMatches.took,
    "special": specialMatches,

    "hits": _.uniq(exactMatches.hits.concat(closeMatches.hits), "exact")
  }
};


function findExact(query) {
    var wantedTerm = query.trim().toLowerCase();

    // Filter out CUI codes that the user already selected
    return function(callback) {
        var elastic_query =  {
            "_source": source,

            "size": 3,

            "query": {
                "term" : {
                    "exact" : wantedTerm
                }
            }
        };

        // Search in all indexes
        var queryObj = {
            "index" : 'autocomplete',
            "body"  : elastic_query
        };

        elasticClient.search(queryObj, function(err, res) {
            var hits = res.hits;
            var result = [];

            if (hits && hits.total > 0) {
                for (var i=0; i < hits.hits.length; i++) {
                    result.push(hits.hits[i]._source);
                }
            }

            callback(err, {
                "took": res.took,
                "hits": result
            });
        });
    }
}


function findMatches(query) {
    var origin = guess_origin(query);

    // Filter out CUI codes that the user already selected
    return function(callback) {

        // DBC code check needs prefix matching
        if (origin === "code") {
            var elastic_query =  {
                "_source": source,
                "size": 6,

                "query": {
                    "match_phrase_prefix" : {
                        "str" : query.trim()
                    }
                }
            };
        }
        else {
            var elastic_query =  {
                "_source": source,
                "size": 6,

                "query": {
                    "function_score" : {
                        "query" : {
                            "match_phrase" : {
                                "str" : query.trim()
                            }
                        },

                        "functions" : [
                            // Prefer SnomedCT / MeSH
                            {
                                "filter": {
                                    "terms": { "source": ["SNOMEDCT_US", "MSH", "MSHDUT"] }
                                },
                                "weight": 1.25
                            },

                            // Negative weight for some categories
                            {
                                "filter": {
                                    "terms": { "types": ["Health Care Activity", "Biomedical Occupation or Discipline"] }
                                },
                                "weight": 0.7
                            }
                        ]
                    }
                }
            };
        }

        var queryObj = {
            "index" : 'autocomplete',
            "body"  : elastic_query
        };

        elasticClient.search(queryObj, function(err, res) {
            var hits = res.hits;
            var result = [];

            if (hits && hits.total > 0) {
                for (var i=0; i < hits.hits.length; i++) {
                    result.push(hits.hits[i]._source);
                }
            }

            callback(err, {
                "took": res.took,
                "hits": result
            });
        });
    }
}


function findSpecial(query) {
    var _query = query.trim().toLowerCase();

    return function(callback) {

        // Check if query matches a demographic option
        for (var i=0; i < DEMOGRAPHICS.length; i++) {
            if (DEMOGRAPHICS[i]["exp"].test(_query)) {
                callback(false, {
                    "str"      : query,
                    "pref"     : "demographic",
                    "cui"      : "custom",
                    "category" : "demographic",
                    "category_type" : DEMOGRAPHICS[i]["type"]
                });

                break;
            }
        }

        callback(false, false);
    }
}