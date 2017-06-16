#!/usr/bin/env node

const _        = require("lodash");
const argv     = require('minimist')(process.argv.slice(2));
const split2   = require('split2');
const through2 = require('through2');

const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": argv.elastic || ""
    }
  ]
});
const ElasticsearchBulkIndexStream = require('elasticsearch-writable-stream');

const index = argv.index || "autocomplete";
const type  = argv.type  || "records";


/////
// Pipe input and store it into Elasticsearch

function stamp() {
    return new Date().toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')
}

var buildRecords = through2({ "objectMode": true }, function(chunk, enc, callback) {
    var line = chunk.toString().trim();

    // (CUI, LAT, SAB, TYPES, PREF, TERMS)

    if (line && line.length) {
        var parts = line.split("\t");

        if (parts.length === 6) {
            var cui   = parts[0];
            var lat   = parts[1];
            var sab   = parts[2];
            var types = parts[3].split("|");
            var pref  = parts[4]
            var terms = parts[5].split("|");

            for (var i=0; i < terms.length; i++) {
                this.push({
                    "index": index,
                    "type" : type,

                    "body": {
                        "cui"    : cui,
                        "str"    : terms[i],
                        "exact"  : terms[i].replace("-", " ").toLowerCase(),
                        "lang"   : lat,
                        "source" : sab,
                        "pref"   : pref,
                        "types"  : types
                    }
                });
            }
        }
    }


    callback();
});


var elasticStream = new ElasticsearchBulkIndexStream(elasticClient, {
    "highWaterMark": 5000,
    "flushTimeout": 500
});

console.info("ELASTICSEARCH", stamp());

process.stdin
  .pipe(split2())
  .pipe(buildRecords)
  .pipe(elasticStream)
  .on('error', function(error) {
      console.error(error);
  })
  .on('finish', function() {
      console.info("DONE", stamp());
  })
