'use strict';

/** Module dependencies. */
var config = require('../config/config.js');
var _      = require('lodash');
var ct     = require('../lib/context');

var request   = require('request-json');
var reqClient = request.newClient(config.elastic + "/autocomplete/");

// Difference with autocomplete.words is that it looks for complete terms
exports.match = function(words, type, size) {
  size = size || 12;

  var context = ct.getContext(type);

  var lookup = {
    "_source" : ["cui", "terms"],
    "query" : {
      "match": {
        "terms" : words.join(' ')
      }
    }
  };

  return function(callback) {
    reqClient.post(context.join(',') + "/_search?size=" + size, lookup, function(err, res, body) {
      callback(err, body);
    });
  };
}
