"use strict";

const config  = require('../../config/config.js');

const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ]
***REMOVED***);


module.exports = function _elastic(cui) {
    return function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "size": 1, // Only need the preferred term for now
            "_source": ["pref"],
            "body" : {
                "query" : {
                    "term" : { "cui" : cui ***REMOVED***
             ***REMOVED***
        ***REMOVED***
    ***REMOVED***,
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits;

            ***REMOVED*** Return ES source part only
                if (hits.length > 0) {
                    return callback(false, { "cui": cui, "pref": hits[0]._source.pref ***REMOVED***);
            ***REMOVED***
        ***REMOVED***

            callback(false, false);
    ***REMOVED***);
***REMOVED***
***REMOVED***