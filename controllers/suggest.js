
var config  = require('../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


module.exports = function *() {
    var params = this.request.body.query;
    var cypherObj = false;

    // Query can be a list of terms or list of object with cui + string
    if (typeof params[0] === "string") {
        var query = 'MATCH (t1:Concept { name:{A} }), (t2:Concept { name:{B} }), (g:Group), (t1)-[:is_part_of]->(g)<-[:is_part_of]-(t2), g<-[:is_part_of]-(r) return t1, t2, g, ID(g) as ID, COLLECT(r) as terms'

        var cypherObj = {
            "query"  : query,
            "params" : {
                "A": params[0].toLowerCase(),
                "B": params[1].toLowerCase()
            },

            "lean": true
        };
    }
    else if (typeof params[0] === "object" && params[0].hasOwnProperty("cui")) {
        var query = 'MATCH (t1:Concept { cui:{A} }), (t2:Concept { cui:{B} }), (g:Group), (t1)-[:is_part_of]->(g)<-[:is_part_of]-(t2), g<-[:is_part_of]-(r) return t1, t2, g, ID(g) as ID, COLLECT(r) as terms'

        var cypherObj = {
            "query"  : query,
            "params" : {
                "A": params[0].cui || "",
                "B": params[1].cui || ""
            },

            "lean": true
        };
    }
    else {
        return this.body = [];
    }


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
