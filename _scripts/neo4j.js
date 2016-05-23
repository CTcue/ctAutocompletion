#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var through2 = require('through2');
var split2 = require('split2');
var Neo4jStream = require('neo4j-batch-index-stream');


function stamp() {
    return new Date().toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')
***REMOVED***

var buildRecords = through2({ objectMode: true ***REMOVED***, function(chunk, enc, callback) {
    var line = chunk.toString().trim();

    if (line && line.length) {
        var parts = line.split("\t");

        var Right = {
            "label" : "Concept",
            "cui" : parts[0],
    ***REMOVED***;

        var Left = {
            "label": "Concept",
            "cui" : parts[2],
    ***REMOVED***

        var relation = {
            "relation" : parts[1],
            "start"    : Left,
            "end"      : Right,
    ***REMOVED***

        this.push(Left);
        this.push(Right);
        this.push(relation);
***REMOVED***

    callback();
***REMOVED***);


var username = "neo4j";
var password = "neo4j";

if (argv.neo4j) {
    var _auth = argv.neo4j.split(":");

    username = _auth[0];
    password = _auth[1];
***REMOVED***

var stream = new Neo4jStream(username, password, {
    "index_key"     : "cui",
    "highWaterMark" : 10000
***REMOVED***);

stream.index([
    ["Concept", "cui"]
]);

console.log("NEO4J", stamp());

process.stdin
.pipe(split2())
.pipe(buildRecords)
.pipe(stream)
.on('error', function(error) {
    console.log(error);
***REMOVED***)
.on('finish', function() {
    console.log("DONE", stamp());
***REMOVED***)
