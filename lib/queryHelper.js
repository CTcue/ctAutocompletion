"use strict";

const config  = require('../config/config.js');

const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ]
***REMOVED***);


const CUI_SOURCES = ["str", "lang", "types", "pref"];


exports.getTermsByCui = function(cui, size) {
    if (typeof size === "undefined") {
        size = 60;
***REMOVED***


    return function(callback) {
        if (!cui) {
            return callback(false, false);
    ***REMOVED***

        elasticClient.search({
            "index": 'autocomplete',
            "size": size,
            "sort": ["_doc"],
            "_source": CUI_SOURCES,

            "body" : {
                "query" : {
                    "term" : {
                        "cui" : cui
                 ***REMOVED***
             ***REMOVED***
        ***REMOVED***
    ***REMOVED***,
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits;

            ***REMOVED*** Return ES source part only
                if (hits.length > 0) {
                    var types = hits[0]._source.types;
                    var pref  = hits[0]._source.pref;

                    return callback(false, [types, pref, hits.map(s => s._source)]);
            ***REMOVED***
        ***REMOVED***
            ***REMOVED***
                callback(false, false);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;
***REMOVED***
