#!/usr/bin/env node


// -----
// pipe logs through this script, which then groups it by 'environments'


const _        = require("lodash");
const split2   = require("split2");
const through2 = require("through2");


const result = {};

const parseRows = through2({ "objectMode": true }, function(chunk, enc, callback) {
    var line = chunk.toString().trim();

    if (!line || !line.length) {
        callback();
        return;
    }

    // Actual info is in the `message`
    try {
        const data = JSON.parse(line);
        const message = data.message || "";
        const [id, info] = message.split("=>");
        const [env, userTyped, cui, selected] = info.split("|").map((s) => s.trim());

        this.push([env, {cui, userTyped, selected, timestamp: data.timestamp }]);
    }
    catch (err) {
        console.error(err);
    }

    callback();
});


process.stdin
    .pipe(split2())
    .pipe(parseRows)
    .on('data', function (data) {
        const [env, info] = data;

        if (!_.has(result, env)) {
            result[env] = [];
        }

        result[env].push(info);
    })
    .on("error", function(error) {
        console.error(error);
    })
    .on("finish", function() {
        console.log(result);
    });
