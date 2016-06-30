"use strict";

const _ = require("lodash");
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


// Autocomplete specialism diagnosis (given specific code)

module.exports = function *() {
    var specialty_code = this.params.code;

    if (! specialty_code || specialty_code.length < 2) {
        return this.body = [];
***REMOVED***

    var result = yield function(callback) {
        elasticClient.search({
          "index" : 'dbc_zorgproduct',
          "type": "diagnosis",
          "size": 500,

          "body" : {
              "query" : {
                  "term" : {
                      "specialism" : specialty_code
               ***REMOVED***
           ***REMOVED***
      ***REMOVED***
    ***REMOVED***,
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits;
                var sources = hits.map(function(s) {
                    return {
                        "label"  : s["_source"]["label"],
                        "number" : s["_source"]["code"]
                ***REMOVED***
            ***REMOVED***);

            ***REMOVED*** Sort the DBC codes
                sources = _.sortBy(sources, "number");
                sources = _.uniq(sources, function(s) {
                    return s["number"].replace(/^0+/, "");
            ***REMOVED***);

                callback(false, sources);
        ***REMOVED***
            ***REMOVED***
                callback(err, []);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;

    this.body = result;
***REMOVED***
