
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
  var result = yield findTerms(query);

  if (result && result.hits) {
      response.took = result.took;
      var resultHits = result.hits.hits;

      // FUTURE
      // Add a scoreThreshold
      //  Note: Elasticsearch scoring is relative, so you cannot use a hardcoded
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


function findTerms(query) {
    query     = query.trim().toLowerCase();
    var words = query.split(" ");

    var simplePrefixQuery = {
        "prefix": {
            "str": {
              "value" : words[0].substring(0,3)
            }
        }
    };

    var prefixQuery = {
        "span_first": {
            "end": 1,
            "match": {
                "span_multi": {
                    "match": {
                        "prefix": {
                            "str": {
                                "value" : words[0].substring(0,3)
                            }
                        }
                    }
                }
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
                "prefix_length"   : 3,
                "analyzer"        : "not_analyzed",
                "like_text"       : query,
                "max_query_terms" : 15
            }
        }
    };

    var lookup = {
        "bool" : {
            "must"   : [],
            "should" : []
        }
    };


    if (words.length === 1) {
        // Single word --> Term query matches shorter words better
        lookup.bool.should.push(simplePrefixQuery);
    }
    else {
        // Multiple words, no need for term
        lookup.bool.should.push(prefixQuery);
    }

    lookup.bool.should.push(phraseQuery);
    lookup.bool.must.push(fuzzyQuery);


    return function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "type"  : 'records',
            "body" : {
                "query" : lookup
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
