
var config  = require('../config/config.js');
var neo4j = require('neo4j');

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


module.exports = function *() {
    var query = 'MATCH (t1:Concept { term:{A} }),(t2:Concept { term:{B} }), p = allShortestPaths((t1)-[:is_part_of*..2]-(t2)) return p';
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
        db.cypher(cypherObj, function(err, result) {
            if (err) {
              // console.log(err);
              callback(false, [])
            }

            // console.log(result)
            callback(null, result)
        });
    }

    this.body = {
        "related": result
    }
};
