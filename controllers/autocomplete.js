
/** Module dependencies. */

var config  = require('../config/config.js');

var guess_origin = require("./lib/guess_origin");
var Trie = require('./lib/trie');
var _ = require("lodash");

var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
***REMOVED***);


const source = ["cui", "str", "exact", "pref", "source", "types"];

// Build regex objects for demographic check
var DEMOGRAPHICS = new Trie(config.demographic_types);


module.exports = function *() {
  var query = this.request.body.query;

  // Check special matches, such as demographic options
  var specialMatches = yield findSpecial(query);

  // Lookup matches in Elasticsearch
  var exactMatches = yield findExact(query);
  var closeMatches = yield findMatches(query);

  this.body = {
    "took": exactMatches.took + closeMatches.took,
    "special": specialMatches,
    "error"  : exactMatches.hasOwnProperty("error"),
    "hits": _.uniq(exactMatches.hits.concat(closeMatches.hits), "exact")
  ***REMOVED***
***REMOVED***;


function findExact(query) {
    var wantedTerm = query.trim().toLowerCase();

***REMOVED*** Filter out CUI codes that the user already selected
    return function(callback) {
        var elastic_query =  {
            "_source": source,

            "size": 3,

            "query": {
                "term" : {
                    "exact" : wantedTerm
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

    ***REMOVED*** Search in all indexes
        var queryObj = {
            "index" : 'autocomplete',
            "body"  : elastic_query
    ***REMOVED***;

        elasticClient.search(queryObj, function(err, res) {
            if (err) {
                return callback(false, { "error": true, "took": 10, "hits": []***REMOVED***)
        ***REMOVED***

            var hits = res.hits;
            var result = [];

            if (hits && hits.total > 0) {
                for (var i=0; i < hits.hits.length; i++) {
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


function findMatches(query) {
    var origin = guess_origin(query);

***REMOVED*** Filter out CUI codes that the user already selected
    return function(callback) {

    ***REMOVED*** DBC code check needs prefix matching
        if (origin === "code") {
            var elastic_query =  {
                "_source": source,
                "size": 6,

                "query": {
                    "match_phrase_prefix" : {
                        "str" : query.trim()
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
        ***REMOVED***
            var elastic_query =  {
                "_source": source,
                "size": 6,

                "query": {
                    "function_score" : {
                        "query" : {
                            "match_phrase" : {
                                "str" : query.trim()
                        ***REMOVED***
                    ***REMOVED***,

                        "functions" : [
                        ***REMOVED*** Prefer SnomedCT / MeSH
                            {
                                "filter": {
                                    "terms": { "source": ["SNOMEDCT_US", "MSH", "MSHDUT"] ***REMOVED***
                            ***REMOVED***,
                                "weight": 1.25
                        ***REMOVED***,

                        ***REMOVED*** Negative weight for some categories
                            {
                                "filter": {
                                    "terms": { "types": ["Health Care Activity", "Biomedical Occupation or Discipline"] ***REMOVED***
                            ***REMOVED***,
                                "weight": 0.7
                        ***REMOVED***
                        ]
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***

        var queryObj = {
            "index" : 'autocomplete',
            "body"  : elastic_query
    ***REMOVED***;

        elasticClient.search(queryObj, function(err, res) {
            if (err) {
                return callback(false, { "error": true, "took": 10, "hits": []***REMOVED***)
        ***REMOVED***

            var hits = res.hits;
            var result = [];

            if (hits && hits.total > 0) {
                for (var i=0; i < hits.hits.length; i++) {
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


function findSpecial(query) {
    var _query = query.trim().toLowerCase();

    return function(callback) {
        var result = false;
        var match = DEMOGRAPHICS.search(_query)

        if (match.length > 0) {
            var split = match[0]["value"].split(":");

            var label = split[0];
            var value = false;

            if (split[1]) {
                label = split[0] + ": " + split[1];

                value = {***REMOVED***;
                value[split[0]] = split[1];
        ***REMOVED***

            var result = {
                "str"      : label,
                "value"    : value,
                "pref"     : "demographic",
                "cui"      : "custom",
                "category" : "demographic"
        ***REMOVED***
    ***REMOVED***

        callback(false, result);
***REMOVED***
***REMOVED***