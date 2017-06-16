'use strict';

var config  = require('../../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


module.exports = function *(next) {
    var body = this.request.body.query;

    var group_name  = body.parent["name"].toLowerCase().trim();
    var abbr        = body.parent["abbr"].trim() || "";
    var description = body.parent["description"].trim() || "";

    var added = 0;

    for (var i=0; i < body.concepts.length; i++) {
        // Pick relevant key/values
        var concept = _.pick(body.concepts[i], ["term", "cui"]);

        if (! concept.hasOwnProperty("term")) {
            continue;
        }

        var insert_concepts = yield function(callback) {
            var cypherObj = {
                "query": `MERGE (g:Group { name: {_NAME_}, abbr: {_ABBR_}, description: {_DESCRIPTION_} })
                          MERGE (c:Concept { name: {_CONCEPT_}, cui: {_CUI_} })
                          WITH g, c
                          CREATE UNIQUE (g)<-[:is_part_of]-(c)
                          RETURN g, c`,

                "params": {
                    "_NAME_"        : group_name,
                    "_ABBR_"        : abbr,
                    "_DESCRIPTION_" : description,
                    "_CONCEPT_"     : concept.term.toLowerCase().trim(),
                    "_CUI_"         : concept.cui || "none"
                },

                "lean" : true
            }

            db.cypher(cypherObj, function(err, res) {
                if (err) {
                    callback(false, false);
                }
                else {
                    callback(false, res);
                }
            });
        }

        if (insert_concepts) {
            added++;
        }
    }

    this.body = added;
};
