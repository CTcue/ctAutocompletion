'use strict';

var config  = require('../../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
***REMOVED***);


module.exports = function *() {
    var name = this.params.name;

    this.body = yield function(callback) {
        var cypherObj = {
            "query": `MATCH (g:Group {name: {_GROUP_***REMOVED*** ***REMOVED***) OPTIONAL MATCH (g)<-[r]-(c) DELETE g, r, c`,
            "params": {
                "_GROUP_": name
        ***REMOVED***,
            "lean": true
    ***REMOVED***

        db.cypher(cypherObj, function(err, res) {
            if (err) {
                console.log(err);
                callback(false, false);
        ***REMOVED***
            ***REMOVED***
                callback(false, res);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***
***REMOVED***;