
/** Module dependencies. */

var config = require('../config/config.js');
var _      = require('lodash');
var sugar  = require('sugar');

var filters = require('../lib/filters.js');
var client  = require('../lib/requestClient.js');

module.exports = function *() {
  var path = config.elastic + "/autocomplete/records/_search?size=" + 30;

  var query = this.body.query;
  var words = query.words();

  var lookup = {
    "_source" : ["cui", "type", "eng"],

    "query" : {
      "function_score" : {
        "query" : {
          "bool" : {
            "must" : {
              "terms" : {
                "eng" : words
              }
            },

            "should" : [
              {
                "match_phrase" : { "eng" : query }
              },
              {
                "prefix" : {
                  "startsWith" :  { "value" : words[0], "boost" : 2 }
                }
              }
            ]
          }
        },

        "script_score" : {
          "script" : "_score * doc['boost'].value"
        },

        "boost_mode" : "replace"
      }
    }
  };

  /*
  var lookup = {
    "_source" : ["cui", "type", "eng"],
    "query" : {
      "match_phrase" : { "eng" : this.body.query }
    }
  };
  */

  var response = {
    "took" : 1000,
    "hits" : []
  };

  var result = yield client.post(path, lookup);

  if (!result || !result.hasOwnProperty('hits') || result.hits.total === 0) {
    return this.body = [];
  }

  response.took = result.took;

  var hits = result.hits.hits;

  for (var i=0, N=hits.length; i<N; i++) {
    response.hits[i] = {
      "score" : hits[i]._score,
      "cui"   : hits[i]._source.cui,
      "terms" : hits[i]._source.eng,
      "type"  : hits[i]._source.type
    };
  }

  this.body = response;
};
