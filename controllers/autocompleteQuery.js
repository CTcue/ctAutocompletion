
/** Module dependencies. */

var config = require('../config/config.js');
var _      = require('lodash');
var sugar  = require('sugar');

var bestMatch = require('../lib/bestMatch.js');
var client    = require('../lib/requestClient.js');

module.exports = function *() {
  var path = config.elastic + "/autocomplete/records/_search?size=" + 30;

  var query = this.body.query;
  var words = query.words();

  var lookup = {
    "_source" : ["cui", "eng"],
    "query" : {
      "bool" : {
        "must" : {
          "terms" : {
            "eng" : words
      ***REMOVED***
    ***REMOVED***,

        "should" : [
          {
            "prefix" : {
              "startsWith" : { "value" : words[0], "boost" : 2 ***REMOVED***
        ***REMOVED***
      ***REMOVED***,

          {
            "fuzzy_like_this_field" : {
              "eng" : {
                "prefix_length"   : 2,
                "analyzer"        : "not_analyzed",
                "like_text"       : query,
                "max_query_terms" : 12,

                "boost" : 0.5
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
        ]
  ***REMOVED***
***REMOVED***,

    "rescore" : {
      "window_size" : 30,
      "query" : {
        "rescore_query" : {
          "function_score" : {
            "script_score" : {
              "script" : "_score * doc['boost'].value"
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
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

      response.hits[i] = {
        "cui"   : resultHits[i]._source.cui,
        "term"  : resultHits[i]._source.eng //bestMatch(resultHits[i]._source.eng, query)
  ***REMOVED***;
***REMOVED***

    this.body = response;
  ***REMOVED***
***REMOVED***;
