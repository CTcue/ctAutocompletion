#!/usr/bin/env node

const _ = require("lodash");
const argv = require("minimist")(process.argv.slice(2));
const split2 = require("split2");
const through2 = require("through2");
const elastic = require("@elastic/elasticsearch");

const config = require("../config/config");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});
const ElasticsearchBulkIndexStream = require("elasticsearch-writable-stream");

const index = argv.index || config.elasticsearch.index || "autocomplete";
const type = argv.type || "_doc";

function stamp() {
    return new Date().toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")
}

const SPLIT_TABS = /\s{2,}|\t/;

const buildRecords = through2({ "objectMode": true }, function (chunk, enc, callback) {
    var line = chunk.toString().trim();

    if (!line || !line.length) {
        callback();
        return;
    }

    // (CUI, LAT, SAB, TYPES, PREF, TERMS)
    // - splits on tabs or >2 spaces
    const parts = line.split(SPLIT_TABS);

    if (!parts || parts.length < 6) {
        callback();
        return;
    }

    const cui = parts[0];
    const lat = parts[1];
    const sab = parts[2].split("|");
    const types = parts[3].split("|");
    const pref = parts[4]
    const terms = parts[5].split("|");

    for (const term of terms) {
        if (!term.length || term.length > 42) {
            continue;
        }

        this.push({
            "index": index,
            "type": type,

            "body": {
                "cui": cui,
                "str": term,
                "exact": term.replace("-", " ").toLowerCase(),
                "lang": lat,
                "source": sab,
                "pref": pref,
                "types": types
            }
        });
    }

    callback();
});

const elasticStream = new ElasticsearchBulkIndexStream(elasticClient, {
    "highWaterMark": 5000,
    "flushTimeout": 500
});

console.info(`\n[${stamp()}] Begin uploading`);

process.stdin
    .pipe(split2())
    .pipe(buildRecords)
    .pipe(elasticStream)
    .on("error", function (error) {
        console.error(error);
    })
    .on("finish", function () {
        console.info(`[${stamp()}] Done.`);
    })
