
/** Module dependencies. */

var config  = require('../config/config.js');
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});

module.exports = function *() {
  var response = {
    "took"  : 220,
    "hits"  : []
  };

  var query = this.request.body.query;
  var selectedIds = this.request.body.selectedIds || [];

  var result = yield findTerms(query, selectedIds);
  if (!result || result.hits.total === 0) {
      result = yield findFuzzyTerms(query, selectedIds);
  }

  if (result && result.hits.total > 0) {
      response.took = result.took;
      var resultHits = result.hits.hits;

      for (var i=0, N=resultHits.length; i<N; i++) {
        response.hits[i]       = resultHits[i]._source;
        response.hits[i].score = resultHits[i]._score;
      }
  }

  this.body = response;
};


function findTerms(query, selectedIds) {
    // Filter out CUI codes that the user already selected
    return function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "type"  : 'records',
            "body" : {

              "query" : {
                    "filtered" : {
                        "query" : {
                            "match_phrase" : {
                              "str" :  query.trim()
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
            }
        }, function(err, res) { callback(err, res); });
    }
}


function findFuzzyTerms(query, selectedIds) {
    // Filter out CUI codes that the user already selected
    return function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "type"  : 'records',
            "body" : {
                "query" : {
                    "match" : {
                        "str" : {
                          "type": "phrase",
                          "fuzziness": "AUTO",
                          "query" :  query.trim()
                        }
                    }
                }
            }
        }, function(err, res) { callback(err, res); });
    }
}
