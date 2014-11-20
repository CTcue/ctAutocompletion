'use strict';

/**
* Module dependencies
*/

var config          = require('../config/config.js');
var _               = require('lodash');
var elastic         = require('elasticsearch');

var elasticOptions  = {
  host  : 'localhost:9200',
  log   : [
    {
      type  : 'file',
      level : 'trace',
      path  : './log/elastic_trace.log'
    },
    {
      type  : 'file',
      level : 'error',
      path  : './log/elastic_error.log'
    }
  ]
};

var elasticClient   = new elastic.Client(elasticOptions);

/**
* Functions
*/

var autocomplete    = function *(searchQuery) {

  var results = [];

  var lookup = {
    "index": "autocomplete",
    "body": {
      "query" : {
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
    }
  };

  elasticClient.suggest(lookup, function (err, response) {
    if (err) {
      return err;
    } else {
      return response;
    };
  });


};

module.exports = autocomplete;