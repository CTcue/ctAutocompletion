
var config  = require('../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


// Skip all CTcue suggestions (ie. log into different environment for updating recommendations)

exports.add = function *() {
    var params = this.request.body.query;
    var cypherObj = buildCypherObj(params.user, params.relation, params.synonym);


    if (! cypherObj) {
        return this.body = false;
    }

    // TODO check if user added custom term


    var result = yield function(callback) {
        db.cypher(cypherObj, function(err, res) {
            if (err) {
                console.log(err);
                callback(false, false);
            }
            else {
                callback(false, res);
            }
        });
    }

    this.body = result;
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

exports.list = function *() {
    var params = this.request.body.query;

    console.log("LIST")
    this.body = true;
};

