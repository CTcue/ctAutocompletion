"use strict";

var config  = require('../../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


module.exports = function *() {

    var groups = yield function(callback) {
        var cypherObj = {
            "query": `MATCH (g:Group) RETURN g.name as name`,
            "lean": true
        }

        db.cypher(cypherObj, function(err, res) {
            if (err) {
                callback(false, []);
            }
            else {
                callback(false, res);
            }
        });
    }


    this.body = groups
}