
/** Module dependencies. */

var config  = require('../config/config.js');
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});

module.exports = function *() {

  var query = this.request.body.query;
  var selectedIds = this.request.body.selectedIds || [];

  var split = query.split(" ")
  var response = {};

  if (split.length <= 1) {
      response = yield findSingle(query, selectedIds);
  }
  else {
      response = yield findTerms(query, selectedIds);
  }

  this.body = response;
};

function findSingle(query, selectedIds) {
    return function(callback) {
        var elastic_query =  {
            "term-suggest": {
                "text": query.trim(),
                "completion": {
                    "field": "suggest",
                    "size": 10,
                     "fuzzy" : {
                       "prefix_length": 5,
                       "fuzziness" : 0.6
                    }
                }
            }
        };

        var queryObj = {
            "index" : 'autocomplete',
            "type"  : 'records',
            "body"  : elastic_query
        };

        elasticClient.suggest(queryObj, function(err, res) {
            var hits = res['term-suggest'][0]["options"];
            var result = [];

            for (var i=0; i<hits.length; i++) {
                result.push({
                  "cui": hits[i].payload['cui'],
                  "str": hits[i].text
                });
            }

            callback(err, {
                "took": 120,
                "hits": result
            });
        });
    }
}

function findTerms(query, selectedIds) {
    // Filter out CUI codes that the user already selected
    return function(callback) {
        var elastic_query =  {
            "_source": ["cui", "str", "source"],

            "query": {
                "filtered" : {
                    "query" : {
                        "function_score": {
                            "query" : {
                                "match_phrase" : {
                                    "str" : query.trim()
                                }
                            },
                            "functions": [
                               {
                                 "filter": {
                                    "term": { "types": ["disorder", "diagnosis", "medication", "Disease or Syndrome", "Disease/Finding"] }
                                  },
                                 "weight": 2
                               },
                               {
                                  "field_value_factor" : {
                                      "field": "votes",
                                      "modifier": "log1p",
                                      "factor":   2
                                  }
                               }
                            ]
                        }
                    },

                    "filter" : {
                        "not" : {
                            "terms" : {
                                "cui" : selectedIds
                            }
                        }
                    }
                }
            }
        };

        var queryObj = {
            "index" : 'autocomplete',
            "type"  : 'records',
            "body"  : elastic_query
        };

        elasticClient.search(queryObj, function(err, res) {
            var hits = res.hits;
            var result = [];

            if (hits.total > 0) {
                for (var i=0; i<hits.hits.length; i++) {
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
