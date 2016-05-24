"use strict";

/** Usage

    curl -X POST -d '{
        "query": [
            { "cui": "C0026187" ***REMOVED***,
            { "str": "rituximab" ***REMOVED***
        ]
***REMOVED***' "https://ctcue.com/umls/suggest"

*/

const config  = require('../config/config.js');
const _ = require("lodash");
const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase({
    "url": 'http://localhost:7474',
    "auth": config.neo4j
***REMOVED***);


module.exports = function *() {
    var params = this.request.body.query;

    if (params.length < 2 || !config.neo4j["is_active"]) {
        return this.body = [];
***REMOVED***

    var cypherObj = buildCypherObj(params);


***REMOVED*** Find "siblings"

    var result = yield function(callback) {
        db.cypher(cypherObj, function(err, paths) {
            if (err) {
              console.log(err);
              return callback(false, [])
        ***REMOVED***

        ***REMOVED*** var found = [];

        ***REMOVED*** for (var i=0; i < paths.length; i++) {
        ***REMOVED***     var finding = paths[i];

        ***REMOVED*** ***REMOVED*** If no group found, skip
        ***REMOVED***     if (! finding.hasOwnProperty("g")) {
        ***REMOVED***         continue;
        ***REMOVED*** ***REMOVED***

        ***REMOVED***     var rel = {
        ***REMOVED***         "groupId"      : finding["ID"],
        ***REMOVED***         "groupName"    : finding["g"]["name"],
        ***REMOVED***         "abbreviation" : finding["g"]["abbr"] || "",
        ***REMOVED***         "description"  : finding["g"]["description"] || "",
        ***REMOVED***         "groupTerms"   : finding["terms"]
        ***REMOVED*** ***REMOVED***

        ***REMOVED***     found.push(rel);
        ***REMOVED*** ***REMOVED***

            callback(null, paths)
    ***REMOVED***);
***REMOVED***

    this.body = result;
***REMOVED***;


function buildCypherObj(params) {
    var cypherObj = false;

    var A = checkParam(params[0]);
    var B = checkParam(params[1]);

    if (A && B) {
        cypherObj = {
            "query"  : buildQuery(A["type"], B["type"]),
            "params" : {
                "A": A["str"],
                "B": B["str"]
        ***REMOVED***,

            "lean": true
    ***REMOVED***;
***REMOVED***

    return cypherObj;
***REMOVED***

function checkParam(param) {
    if (typeof param === "string") {
        return { "type": "name", "str": param.toLowerCase() ***REMOVED***;
***REMOVED***

    if (typeof param === "object") {
        if (param.hasOwnProperty("cui") && param.cui.length > 1 && param.cui[0] === "C") {
            return { "type": "cui", "str": param.cui ***REMOVED***;
    ***REMOVED***

        return { "type": "name", "str": param.str || param.name || "" ***REMOVED***;
***REMOVED***

    return false;
***REMOVED***

function buildQuery(keyA, keyB) {
    return `MATCH (t1:Concept { ${keyA***REMOVED***: {A***REMOVED*** ***REMOVED***), (t2:Concept { ${keyB***REMOVED***: {B***REMOVED*** ***REMOVED***),
            p = shortestPath((t1)<-[*..4]->(t2))
            return p`
***REMOVED***