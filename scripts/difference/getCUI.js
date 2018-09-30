#!/usr/bin/env node

const _ = require("lodash");
const split2 = require("split2");
const through2 = require("through2");

const SPLIT_TABS = /(\s{2,}|\t)/;

var printCUI = through2({ "objectMode": true }, function(chunk, enc, callback) {
    var line = chunk.toString().trim();

    if (!line || !line.length) {
        callback();
        return;
    }

    // (CUI, LAT, SAB, TYPES, PREF, TERMS, 'votes')
    // - splits on tabs or >2 spaces
    const parts = line.split(SPLIT_TABS);

    if (!parts || !parts.length) {
        callback();
        return;
    }

    const cui = parts[0];

    if (cui[0] === "C") {
        console.log(cui);
    }

    callback();
});


process.stdin
  .pipe(split2())
  .pipe(printCUI)
  .on("error", function(error) {
      console.error(error);
  })
  .on("finish", function() {
      // Pass
  });
