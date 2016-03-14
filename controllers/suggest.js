
var config  = require('../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


module.exports = function *() {
    var params = this.request.body.query;

    if (params.length < 2 || !config.neo4j["is_active"]) {
        return this.body = [];
    }

    var cypherObj = buildCypherObj(params);

    var result = yield function(callback) {
        db.cypher(cypherObj, function(err, paths) {
            if (err) {
              console.log(err);
              return callback(false, [])
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
            },

            "lean": true
        };
    }

    return cypherObj;
}

function checkParam(param) {
    if (typeof param === "string") {
        return { "type": "name", "str": param.toLowerCase() };
    }

    if (typeof param === "object") {
        if (param.hasOwnProperty("cui") && param.cui.length > 1 && param.cui[0] === "C") {
            return { "type": "cui", "str": param.cui };
        }

        return { "type": "name", "str": param.str || param.name || "" };
    }

    return false;
}

function buildQuery(keyA, keyB) {
    return `MATCH (t1:Concept { ${keyA}: {A} }), (t2:Concept { ${keyB}: {B} }),
            (g:Group),
            (t1)-[:is_part_of]->(g)<-[:is_part_of]-(t2),
            g<-[:is_part_of]-(r)
            return t1, t2, g, ID(g) as ID, COLLECT(r) as terms`
}