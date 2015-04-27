
/** Module dependencies. */

var config  = require('../config/config.js');
var _       = require('lodash');
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
***REMOVED***);

module.exports = function *() {
  var response = {
    "took"  : 1000,
    "hits"  : []
  ***REMOVED***;

  var query = this.request.body.query;
  var result = yield findTerms(query);

  if (result && result.hits) {
      response.took = result.took;
      var resultHits = result.hits.hits;

  ***REMOVED*** FUTURE
  ***REMOVED*** Add a scoreThreshold
  ***REMOVED***  Note: Elasticsearch scoring is relative, so you cannot use a hardcoded
  ***REMOVED***        threshold. Perhaps k-means to create two groups "high/low" scoring
  ***REMOVED***        and only return the "high" scoring group.

      for (var i=0, N=resultHits.length; i<N; i++) {
        response.hits[i]       = resultHits[i]._source;
        response.hits[i].score = resultHits[i]._score;
  ***REMOVED***
  ***REMOVED***

  this.body = response;
***REMOVED***;


function findTerms(query) {
    query     = query.trim().toLowerCase();
    var words = query.split(" ");

    var termQuery = {
        "term": {
            "str": {
              "value" : words[0]
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    var prefixQuery = {
        "span_first": {
            "end": 1,
            "match": {
                "span_multi": {
                    "match": {
                        "prefix": {
                            "str": {
                                "value" : words[0]
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    var phraseQuery = {
        "match" : {
            "str" : {
              "type"  : "phrase",
              "query" : query,
              "boost" : 1.5
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    var fuzzyQuery = {
        "fuzzy_like_this_field" : {
            "str" : {
                "prefix_length"   : 3,
                "analyzer"        : "not_analyzed",
                "like_text"       : query,
                "max_query_terms" : 8
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    var lookup = {
        "bool" : {
            "must" : []
    ***REMOVED***
***REMOVED***;


    if (words.length === 1) {
    ***REMOVED*** Single word --> Term query matches shorter words better
        lookup.bool.must.push(termQuery);
***REMOVED***
    ***REMOVED***
    ***REMOVED*** With multiple words, we need to make sure it has the right prefix
        lookup.bool.must.push(prefixQuery);
***REMOVED***

    if (query.length > 4) {
        lookup.bool.must.push(phraseQuery);
***REMOVED***


    return function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "type"  : 'records',
            "body" : {
                "query" : lookup
        ***REMOVED***
    ***REMOVED***,
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                callback(err, resp);
        ***REMOVED***
            ***REMOVED***
            ***REMOVED*** Nothing found --> Find alternatives with fuzzy query
                elasticClient.search(
                    {
                        "index" : 'autocomplete',
                        "type"  : 'records',
                        "body" : {
                            "query" : fuzzyQuery
                    ***REMOVED***
                ***REMOVED***,
                    function(err2, resp2) {
                      resp2.took += resp.took;
                      callback(err2, resp2);
                ***REMOVED***
                );
        ***REMOVED***
    ***REMOVED***)
***REMOVED***
***REMOVED***
