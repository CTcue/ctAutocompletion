
/** Module dependencies. */

var config  = require('../config/config.js');
var _       = require('lodash');
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});

module.exports = function *() {
  var response = {
    "took"  : 1000,
    "hits"  : []
  };

  var query = this.request.body.query;
  var selectedIds = this.request.body.selectedIds || [];
  var result = yield findTerms(query, selectedIds);

  if (result && result.hits) {
      response.took = result.took;
      var resultHits = result.hits.hits;

      // TODO : Add a scoreThreshold
      // Note : Elasticsearch scoring is relative, so you cannot use a hardcoded
      //        threshold. Perhaps k-means to create two groups "high/low" scoring
      //        and only return the "high" scoring group.

      for (var i=0, N=resultHits.length; i<N; i++) {
        response.hits[i]       = resultHits[i]._source;
        response.hits[i].score = resultHits[i]._score;
      }

      response.hits.sort(function(a, b) {
            // For similar score, order by shortest string first
            if (a.score === b.score) {
                return a.str.length - b.str.length;
            }

            // Else rank from highest score to lowest
            return b.score - a.score;
      });
  }

  this.body = response;
};


function findTerms(query, selectedIds) {
    query     = query.trim().toLowerCase();
    var words = query.split(" ");

    var simplePrefixQuery = {
        "prefix": {
            "str": {
              "analyzer": "standard",
              "value" : words[0][0]
            }
        }
    };

    var phraseQuery = {
        "match" : {
            "str" : {
              "type"  : "phrase",
              "query" : query,
              "boost" : 1.5
            }
        }
    };

    var fuzzyQuery = {
        "fuzzy_like_this_field" : {
            "str" : {
                "prefix_length"   : 1,
                "analyzer"        : "not_analyzed",
                "like_text"       : query,
                "max_query_terms" : 12
            }
        }
    };

    var lookup = {
        "dis_max" : {
            "tie_breaker" : 0.7,
            "queries" : [phraseQuery, fuzzyQuery, simplePrefixQuery]
        }
    }

    // Filter out CUI codes that the user already selected
    return function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "type"  : 'records',
            "body" : {
                "query" : {
                    "filtered" : {
                        "query" : lookup,

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
        },
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                callback(err, resp);
            }
            else {
                // Nothing found --> Find alternatives with fuzzy query
                elasticClient.search(
                    {
                        "index" : 'autocomplete',
                        "type"  : 'records',
                        "body" : {
                            "query" : fuzzyQuery
                        }
                    },
                    function(err2, resp2) {
                      resp2.took += resp.took;
                      callback(err2, resp2);
                    }
                );
            }
        })
    }
}
