
var neo4j = require('neo4j');

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: {
        username: 'neo4j',
        password: 'test123'
    }
});


//  MATCH (c:Concept {snomed_id: "88279005AND372888006"})<-[:is_a]-(t)<-[:pref_term]-(r) return r


module.exports = function *() {

    var query = 'MATCH (t1:Term { term:{A} }),(t2:Term { term:{B} }), p = allShortestPaths((t1)-[:term|is_a*..5]-(t2)) return p';
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
