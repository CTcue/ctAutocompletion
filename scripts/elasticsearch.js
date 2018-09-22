#!/usr/bin/env node


// -----
// pipe input through this script, which then stores it into Elasticsearch


const _        = require("lodash");
const argv     = require("minimist")(process.argv.slice(2));
const split2   = require("split2");
const through2 = require("through2");

const elasticHelper = require("../src/lib/elasticHelper");
const elasticClient = elasticHelper.client();

const ElasticsearchBulkIndexStream = require("elasticsearch-writable-stream");

const index = argv.index || "autocomplete";
const type  = argv.type  || "_doc";


function stamp() {
    return new Date().toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
}

var buildRecords = through2({ "objectMode": true }, function(chunk, enc, callback) {
    var line = chunk.toString().trim();

    if (!line || !line.length) {
        callback();
        return;
    }

    // (CUI, LAT, SAB, TYPES, PREF, TERMS)
    const parts = line.split("\t");

    if (!parts || parts.length !== 6) {
        callback();
        return;
    }

    const cui   = parts[0];
    const lat   = parts[1];
    const sab   = parts[2];
    const types = parts[3].split("|");
    const pref  = parts[4];
    const terms = parts[5].split("|");

    for (const term of terms) {
        this.push({
            "index": index,
            "type" : type,

            "body": {
                "cui"    : cui,
                "str"    : term,
                "lang"   : lat,
                "source" : sab,
                "pref"   : pref,
                "types"  : types
            }
        });
    }

    callback();
});


var elasticStream = new ElasticsearchBulkIndexStream(elasticClient, {
    "highWaterMark" : 5000,
    "flushTimeout"  : 500
});

console.info(`\n[${stamp()}] Begin uploading`);

process.stdin
  .pipe(split2())
  .pipe(buildRecords)
  .pipe(elasticStream)
  .on("error", function(error) {
      console.error(error);
  })
  .on("finish", function() {
      console.info(`[${stamp()}] Done.`);
  });
