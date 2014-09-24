'use strict';

/** Module dependencies. */
var config    = require('../config/config.js');
var _         = require('lodash');
var reqClient = require('request-json').newClient(config.elastic.db.host);

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
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***;

    reqClient.post('/diagnose/_suggest', lookup,
      function (err, response, body) {

        if (err && err.code === "ECONNREFUSED") {
          console.log("Please start elasticsearch!");
          process.exit(1);
    ***REMOVED***;

        if (body
          && body.result
          && body.result[0].options
          && body.result[0].options.length > 0) {

          results = body.result[0].options;

      ***REMOVED*** Create usable object
          results = _.map(results, function(result) {
            return result.text.split(' | ')[0];
      ***REMOVED***);

      ***REMOVED*** Sort shortest to longest
          results = results.sort(function(a, b) {
            return a.length - b.length;
      ***REMOVED***);

    ***REMOVED***;

        callback(err, results);
  ***REMOVED***);

  ***REMOVED***;
***REMOVED***;

module.exports = autocomplete;