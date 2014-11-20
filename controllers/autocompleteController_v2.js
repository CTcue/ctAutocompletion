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
***REMOVED***,
    {
      type  : 'file',
      level : 'error',
      path  : './log/elastic_error.log'
***REMOVED***
  ]
***REMOVED***;

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
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  elasticClient.suggest(lookup, function (err, response) {
    if (err) {
      return err;
***REMOVED*** ***REMOVED***
      return response;
***REMOVED***;
  ***REMOVED***);


***REMOVED***;

module.exports = autocomplete;