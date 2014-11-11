'use strict';

/** Module dependencies. */
var config    = require('../config/config.js');
var _         = require('lodash');
var reqClient = require('request-json').newClient(config.elastic);

function autocomplete(searchQuery) {
  return function(callback) {

    var results = [];

    var lookup = {
      "result" : {
        "text" : searchQuery,
        "completion" : {
          "size"  : 8,
          "field" : "title",
          "fuzzy" : {
            "min_length"    : 3,
            "prefix_length" : 5
          }
        }
      }
    };

    reqClient.post('/diagnose/_suggest', lookup,
      function (err, response, body) {

        if (err && err.code === "ECONNREFUSED") {
          console.log("Please start elasticsearch!");
          process.exit(1);
        };

        if (body
          && body.result
          && body.result[0].options
          && body.result[0].options.length > 0) {

          results = body.result[0].options;

          // Create usable object
          results = _.map(results, function(result) {
            return result.text.split(' | ')[0];
          });

          // Sort shortest to longest
          results = results.sort(function(a, b) {
            return a.length - b.length;
          });

        };

        callback(err, results);
      });

  };
};

module.exports = autocomplete;