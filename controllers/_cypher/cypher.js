"use strict";

const _ = require("lodash");

const config  = require('../../config/config.js');
const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase({
    "url": 'http://localhost:7474',
    "auth": config.neo4j
***REMOVED***);

// @params -> parameters for build query
// @query  -> Cypher query that is able to `COLLECT(distinct x) as list`

// --> returns list of CUI's

module.exports = function _cypher(params, query) {

    var cypherObj = {
        "query"  : query,
        "params" : params,
        "lean": true
***REMOVED***

    return function(callback) {
        db.cypher(cypherObj, function(err, paths) {
            if (err) {
                console.error("NEO4J: ", err);
                return callback(false, [])
        ***REMOVED***

            if (!paths || paths.length < 1 || !_.has(paths[0], "list")) {
                return callback(false, []);
        ***REMOVED***

            callback(null, paths[0]["list"].map(s => s["cui"]));
    ***REMOVED***);
***REMOVED***
***REMOVED***
