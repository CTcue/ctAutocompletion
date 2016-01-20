
var config  = require('../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
***REMOVED***);


module.exports = function *() {
***REMOVED*** var query = 'MATCH (t1:Concept { name:{A***REMOVED*** ***REMOVED***), (t2:Concept { name:{B***REMOVED*** ***REMOVED***), p = allShortestPaths((t1)-[:is_part_of*..2]-(t2)) return p, ID(p)';
    var query = 'MATCH (t1:Concept { name:{A***REMOVED*** ***REMOVED***), (t2:Concept { name:{B***REMOVED*** ***REMOVED***), (g:Group), (t1)-[:is_part_of]->(g)<-[:is_part_of]-(t2), g<-[:is_part_of]-(r) return t1, t2, g, ID(g) as ID, COLLECT(r) as terms'
    var params = this.request.body.query;

    var cypherObj = {
        "query"  : query,
        "params" : {
            "A": params[0],
            "B": params[1]
    ***REMOVED***,

        "lean": true
***REMOVED***;

    var result = yield function(callback) {
        db.cypher(cypherObj, function(err, paths) {
            if (err) {
              console.log(err);
              callback(false, [])
        ***REMOVED***

            var found = [];

            for (var i=0; i < paths.length; i++) {
                var finding = paths[i];

            ***REMOVED*** If no group found, skip
                if (! finding.hasOwnProperty("g")) {
                    continue;
            ***REMOVED***

                var rel = {
                    "groupId": finding["ID"],
                    "groupName": finding["g"]["name"],
                    "abbreviation": finding["g"]["abbr"] || "",
                    "description" : finding["g"]["description"] || "",
                    "groupTerms"  : finding["terms"]
            ***REMOVED***

                found.push(rel);
        ***REMOVED***

            callback(null, found)
    ***REMOVED***);
***REMOVED***

    this.body = result;
***REMOVED***;
