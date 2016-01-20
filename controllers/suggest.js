
var neo4j = require('neo4j');

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: {
        username: 'neo4j',
        password: 'test123'
***REMOVED***
***REMOVED***);


//  MATCH (c:Concept {snomed_id: "88279005AND372888006"***REMOVED***)<-[:is_a]-(t)<-[:pref_term]-(r) return r


module.exports = function *() {

    var query = 'MATCH (t1:Term { term:{A***REMOVED*** ***REMOVED***),(t2:Term { term:{B***REMOVED*** ***REMOVED***), p = allShortestPaths((t1)-[:term|is_a*..5]-(t2)) return p';
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
        db.cypher(cypherObj, function(err, result) {
            if (err) {
          ***REMOVED*** console.log(err);
              callback(false, [])
        ***REMOVED***

        ***REMOVED*** console.log(result)
            callback(null, result)
    ***REMOVED***);
***REMOVED***

    this.body = {
        "related": result
***REMOVED***
***REMOVED***;
