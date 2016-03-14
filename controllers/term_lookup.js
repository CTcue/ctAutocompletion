
/** Module dependencies. */

var config  = require('../config/config.js');

var guess_origin = require("./lib/guess_origin");
var _ = require("lodash");

var elastic = require('elasticsearch');
var elasticClient = new elastic.Client();


const source = ["cui", "str", "exact", "pref"];


module.exports = function *() {
  var query = this.request.body.query;

  // Lookup matches in Elasticsearch
  var exactMatches = yield findExact(query);

  this.body = {
    "took": exactMatches.took,
    "hits": exactMatches.hits
  }
};


function findExact(query) {
    var wantedTerm = query.trim().toLowerCase();

    var fuzziness = 0;
    if (query.length > 10) {
        fuzziness = 2;
    }
    else if (query.length > 5) {
        fuzziness = 1;
    }

    // Filter out CUI codes that the user already selected
    return function(callback) {
        var elastic_query =  {
            "_source": source,

            "size": 3,

            "query": {
                "fuzzy" : {
                    "exact" : {
                        "value": wantedTerm,
                        "fuzziness": fuzziness,
                        "prefix_length": 4
                    }
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
