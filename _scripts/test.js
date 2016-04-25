#!/usr/bin/env node

const _ = require("lodash");
const config = require('../config/config.js');

const through2 = require('through2');
const split2 = require('split2');



const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ]
***REMOVED***);
const ElasticsearchBulkIndexStream = require('elasticsearch-bulk-index-stream');



const index = "autocomplete2";
const type  = "records";


var buildRecords = through2({ objectMode: true ***REMOVED***, function(chunk, enc, callback) {
    var line = chunk.toString().trim();

    if (line && line.length) {
        var parts = line.split("\t");

        var cui   = parts[0];
        var types = parts[1].split("|");
        var terms = parts[2].split("|");

        for (var i=0; i < terms.length; i++) {
            this.push({
                "index": index,
                "type" : type,

                "body": {
                    "cui": cui,
                    "str": terms[i]
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
***REMOVED***

    callback();
***REMOVED***);


var elasticStream = new ElasticsearchBulkIndexStream(elasticClient, {
  highWaterMark: 256,
  flushTimeout: 500
***REMOVED***);


process.stdin
  .pipe(split2())
  .pipe(buildRecords)
  .pipe(elasticStream)
  .on('error', function(error) {
        console.log(error);
    ***REMOVED*** Handle error
  ***REMOVED***)
  .on('finish', function() {
        console.log("DONE");
    ***REMOVED*** Clean up Elasticsearch client?
  ***REMOVED***)
