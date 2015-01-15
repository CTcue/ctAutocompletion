
/** Module dependencies. */

var config = require('../config/config.js');
var _      = require('lodash');
var sugar  = require('sugar');

var client    = require('../lib/requestClient.js');

module.exports = function *() {
  var path = config.elastic + "/autocomplete/records/_search?size=20";

  var query = this.body.query;
  var words = query.words();

  var lookup = {
    "_source" : ["cui", "str"],
    "query" : {
      "dis_max" : {
        "tie_breaker" : 0.3,

        "queries" : [
          {
            "match" : {
              "str" : {
                "type"  : "phrase",
                "query" : query,
                "boost" : 0.5
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***,

          {
            "terms" : {
                "str" : words,
                "minimum_should_match" : 1
        ***REMOVED***
      ***REMOVED***,

          {
            "prefix" : {
              "str" : words[0].substring(0,5)
        ***REMOVED***
      ***REMOVED***,

          {
            "fuzzy_like_this_field" : {
              "str" : {
                "prefix_length"   : 2,
                "analyzer"        : "not_analyzed",
                "like_text"       : query,
                "max_query_terms" : 8
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
        ]
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  var response = {
    "took"  : 1000,
    "hits"  : []
  ***REMOVED***;

  var result = yield client.post(path, lookup);

  if (!result || !result.hasOwnProperty('hits') || result.hits.total === 0) {
***REMOVED*** Error
    console.log(result);

    this.body = [];
  ***REMOVED***
  ***REMOVED***
    response.took  = result.took;

    var resultHits = result.hits.hits;
***REMOVED*** var scoreThreshold = result.hits.max_score * 0.5;

    for (var i=0, N=resultHits.length; i<N; i++) {
      /*
      TODO : Find method do set an appropriate scoreThreshold

  ***REMOVED*** Check if result score is good enough
  ***REMOVED*** > Mostly since we use fuzzy matching
      if (resultHits[i]._score < scoreThreshold) {
        break;
  ***REMOVED***
      */

      response.hits[i] = resultHits[i]._source;
***REMOVED***

    this.body = response;
  ***REMOVED***
***REMOVED***;
