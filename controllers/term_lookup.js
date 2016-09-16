
/** Module dependencies. */

const config  = require('../config/config.js');

const _ = require("lodash");

const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ],
***REMOVED***);

const source = ["cui", "str", "exact", "pref","types"];


module.exports = function *() {
    var query = this.request.body.query;

***REMOVED*** Lookup matches in Elasticsearch
    var exactMatches = yield findExact(query);

    this.body = {
        "took": exactMatches.took,
        "hits": exactMatches.hits,
        "error": exactMatches.error || false
***REMOVED***
***REMOVED***;


function findExact(query) {
    var wantedTerm = query.trim().toLowerCase();

    var fuzziness = 0;
    if (query.length > 10) {
        fuzziness = 2;
***REMOVED***
    else if (query.length > 5) {
        fuzziness = 1;
***REMOVED***

***REMOVED*** Filter out CUI codes that the user already selected
    return function(callback) {
        var elastic_query =  {
            "_source": source,

            "size": 3,

            "query": {
                "fuzzy" : {
                    "exact" : {
                        "value": wantedTerm,
                        "fuzziness": fuzziness,
                        "prefix_length": 4
                ***REMOVED***
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
                return callback(false, {
                    "took": 0,
                    "hits": [],
                    "error": err
            ***REMOVED***)
        ***REMOVED***

            var hits = res.hits;
            var result = [];

            if (hits && hits.total > 0) {
                for (var i=0; i < hits.hits.length; i++) {
                    result.push(hits.hits[i]._source);
            ***REMOVED***
        ***REMOVED***

            callback(false, {
                "took": res.took,
                "hits": result
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***
***REMOVED***
