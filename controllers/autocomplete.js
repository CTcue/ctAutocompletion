
/** Module dependencies. */

var config  = require('../config/config.js');
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
***REMOVED***);

module.exports = function *() {

  var query = this.request.body.query;
  var selectedIds = this.request.body.selectedIds || [];

  var split = query.split(" ")
  var response = {***REMOVED***;

  if (split.length <= 1) {
      response = yield findSingle(query, selectedIds);
  ***REMOVED***
  ***REMOVED***
      response = yield findTerms(query, selectedIds);
  ***REMOVED***

  this.body = response;
***REMOVED***;

function findSingle(query, selectedIds) {
    return function(callback) {
        var elastic_query =  {
            "term-suggest": {
                "text": query.trim(),
                "completion": {
                    "field": "suggest",
                    "size": 10,
                     "fuzzy" : {
                       "prefix_length": 5,
                       "fuzziness" : 0.6
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        var queryObj = {
            "index" : 'autocomplete',
            "type"  : 'records',
            "body"  : elastic_query
    ***REMOVED***;

        elasticClient.suggest(queryObj, function(err, res) {
            var hits = res['term-suggest'][0]["options"];
            var result = [];

            for (var i=0; i<hits.length; i++) {
                result.push({
                  "cui": hits[i].payload['cui'],
                  "str": hits[i].text
            ***REMOVED***);
        ***REMOVED***

            callback(err, {
                "took": 120,
                "hits": result
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***
***REMOVED***

function findTerms(query, selectedIds) {
***REMOVED*** Filter out CUI codes that the user already selected
    return function(callback) {
        var elastic_query =  {
            "_source": ["cui", "str", "source"],

            "query": {
                "filtered" : {
                    "query" : {
                        "function_score": {
                            "query" : {
                                "match_phrase" : {
                                    "str" : query.trim()
                            ***REMOVED***
                        ***REMOVED***,
                            "functions": [
                               {
                                 "filter": {
                                    "term": { "types": ["disorder", "diagnosis", "medication", "Disease or Syndrome", "Disease/Finding"] ***REMOVED***
                              ***REMOVED***,
                                 "weight": 2
                           ***REMOVED***,
                               {
                                  "field_value_factor" : {
                                      "field": "votes",
                                      "modifier": "log1p",
                                      "factor":   2
                              ***REMOVED***
                           ***REMOVED***
                            ]
                    ***REMOVED***
                ***REMOVED***,

                    "filter" : {
                        "not" : {
                            "terms" : {
                                "cui" : selectedIds
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        var queryObj = {
            "index" : 'autocomplete',
            "type"  : 'records',
            "body"  : elastic_query
    ***REMOVED***;

        elasticClient.search(queryObj, function(err, res) {
            var hits = res.hits;
            var result = [];

            if (hits.total > 0) {
                for (var i=0; i<hits.hits.length; i++) {
                    result.push(hits.hits[i]._source);
            ***REMOVED***
        ***REMOVED***

            callback(err, {
                "took": res.took,
                "hits": result
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***
***REMOVED***
