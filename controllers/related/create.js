'use strict';

var config  = require('../../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
***REMOVED***);


module.exports = function *(next) {
    var body = this.request.body.query;

    var group_name  = body.parent["name"].toLowerCase().trim();
    var abbr        = body.parent["abbr"].trim() || "";
    var description = body.parent["description"].trim() || "";

    var added = 0;

    for (var i=0; i < body.concepts.length; i++) {
    ***REMOVED*** Pick relevant key/values
        var concept = _.pick(body.concepts[i], ["term", "cui"]);

        if (! concept.hasOwnProperty("term")) {
            continue;
    ***REMOVED***

        var insert_concepts = yield function(callback) {
            var cypherObj = {
                "query": `MERGE (g:Group { name: {_NAME_***REMOVED***, abbr: {_ABBR_***REMOVED***, description: {_DESCRIPTION_***REMOVED*** ***REMOVED***)
                          MERGE (c:Concept { name: {_CONCEPT_***REMOVED***, cui: {_CUI_***REMOVED*** ***REMOVED***)
                          WITH g, c
                          CREATE UNIQUE (g)<-[:is_part_of]-(c)
                          RETURN g, c`,

                "params": {
                    "_NAME_"        : group_name,
                    "_ABBR_"        : abbr,
                    "_DESCRIPTION_" : description,
                    "_CONCEPT_"     : concept.term.toLowerCase().trim(),
                    "_CUI_"         : concept.cui || "none"
            ***REMOVED***,

                "lean" : true
        ***REMOVED***

            db.cypher(cypherObj, function(err, res) {
                if (err) {
                    callback(false, false);
            ***REMOVED***
                ***REMOVED***
                    callback(false, res);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

        if (insert_concepts) {
            added++;
    ***REMOVED***
***REMOVED***

    this.body = added;
***REMOVED***;
