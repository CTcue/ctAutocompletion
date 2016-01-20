
var config  = require('../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


module.exports = function *() {
    // var query = 'MATCH (t1:Concept { name:{A} }), (t2:Concept { name:{B} }), p = allShortestPaths((t1)-[:is_part_of*..2]-(t2)) return p, ID(p)';
    var query = 'MATCH (t1:Concept { name:{A} }), (t2:Concept { name:{B} }), (g:Group), (t1)-[:is_part_of]->(g)<-[:is_part_of]-(t2), g<-[:is_part_of]-(r) return t1, t2, g, ID(g) as ID, COLLECT(r) as terms'
    var params = this.request.body.query;

    var cypherObj = {
        "query"  : query,
        "params" : {
            "A": params[0],
            "B": params[1]
        },

        "lean": true
    };

    var result = yield function(callback) {
        db.cypher(cypherObj, function(err, paths) {
            if (err) {
              console.log(err);
              callback(false, [])
            }

            var found = [];

            for (var i=0; i < paths.length; i++) {
                var finding = paths[i];

                // If no group found, skip
                if (! finding.hasOwnProperty("g")) {
                    continue;
                }

                var rel = {
                    "groupId": finding["ID"],
                    "groupName": finding["g"]["name"],
                    "abbreviation": finding["g"]["abbr"] || "",
                    "description" : finding["g"]["description"] || "",
                    "groupTerms"  : finding["terms"]
                }

                found.push(rel);
            }

            callback(null, found)
        });
    }

    this.body = result;
};
