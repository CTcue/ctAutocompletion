
var config  = require('../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});

var mongoDb = require('../lib/database');
var table   = mongoDb.table('umls');


module.exports = function * recommend() {
    var params = this.request.body.query;


    // Create Cypher query if neo4j is active
    if (_.get(config, "neo4j.is_active")) {
        var cypherObj = buildCypherObj(params.user, params.relation, params.synonym);

        if (cypherObj) {
            var addedRelation = yield function(callback) {
                db.cypher(cypherObj, function(err, res) {
                    if (err) {
                        callback(false, false);
                    }
                    else {
                        callback(false, true);
                    }
                });
            }
        }
    }


    // Store it in mongoDb for concept_manager
    var addedTerm = false;

    if (_.has(params, "relation") && params.relation === "LIKES") {
        var data = {
            "user"     : params.user,
            "synonym"  : params.synonym,
            "isCustom" : (params.hasOwnProperty("isCustom") && params.isCustom),
            "created"  : new Date()
        };

        addedTerm = yield table.insert(data);
    }


    this.body = !_.isEmpty(addedTerm);
};


function buildCypherObj(user, relation, synonym) {
    if (typeof user === "undefined" || !user || !user.hasOwnProperty("_id")) {
        return false;
    }
    if (typeof synonym === "undefined" || !synonym || !synonym.hasOwnProperty("term")) {
        return false;
    }

    if (typeof relation === "undefined") {
        relation = "DISLIKES";
    }

    var today = getDateToday();


    // MERGE to make sure we add unique users and concepts
    // CREATE UNIQUE to make sure we store user pref only once per day
    // - One user can contribute very little
    return {
        "query": `MERGE (u:User { id: {_USER_}, env: {_ENV_} })
                  MERGE (s:Synonym { cui: {_CUI_}, label: {_LABEL_}, str: {_TERM_} })
                  WITH u, s
                  CREATE UNIQUE
                     (u)-[:${relation} { date: '${today}' }]->(s)
                  RETURN u, s`,

        "params": {
            "_USER_"  : user._id,
            "_ENV_"   : user.env.trim().toLowerCase(),
            "_CUI_"   : synonym.cui,
            "_LABEL_" : synonym.label.trim().toLowerCase(),
            "_TERM_"  : synonym.term.trim().toLowerCase()
        },

        "lean" : true
    };
}


// Return YYYY.MM.DD date format
function getDateToday() {
    var date = new Date();
    return date.getFullYear() + "." + (date.getMonth()+1) + "." + date.getDay();
}
