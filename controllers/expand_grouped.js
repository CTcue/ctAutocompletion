
var config  = require('../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


var elastic = require('elasticsearch');
var elasticClient = new elastic.Client();

var getCategory = require("./lib/category.js");

const source = ["str", "lang", "types"];
const language_map = {
    "DUT" : "dutch",
    "ENG" : "english"
};

module.exports = function *() {

    var body = this.request.body.query;


    var result = yield function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "size": 100,

            "_source": source,

            "body" : {
                "query" : {
                    "term" : {
                        "cui" : body
                     }
                 }
            }
        },
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits;

                // Return ES source part only
                if (hits.length) {
                    var types = hits[0]._source.types;
                    return callback(false, [types, hits.map(s => s._source)]);
                }
            }

            callback(false, false);
        });
    };


    var types       = [];
    var found_terms = [];

    if (result) {
        types       = result[0];
        found_terms = result[1];
    }


    // Check for user contributions
    // - If the current user added custom concepts/synonyms
    if (config.neo4j["is_active"]) {

        if (this.user) {
            var user_contributed = yield function(callback) {

                var cypherObj = {
                    "query": `MATCH
                                (s:Synonym {cui: {_CUI_} })<-[r:LIKES]-(u:User { id: { _USER_ }, env: { _ENV_ } })
                              RETURN
                                s.str as str, s.label as label`,

                    "params": {
                        "_CUI_": body,
                        "_USER_": this.user._id,
                        "_ENV_" : this.user.env
                    },

                    "lean": true
                }


                db.cypher(cypherObj, function(err, res) {
                    if (err) {
                        console.log(err);
                        callback(false, []);
                    }
                    else {
                        callback(false, res);
                    }
                });
            }

            // Add user contributions
            if (user_contributed && user_contributed.length) {
                found_terms = found_terms.concat(user_contributed);
            }
        }


        // Check if anyone (any user) has unchecked concepts/synonyms
        // - Need more than 1 "downvote"
        var uncheck = yield function(callback) {
            var cypherObj = {
                "query": `MATCH
                            (s:Synonym {cui: {_CUI_} })<-[r:DISLIKES]-(u:User)
                          WITH
                            type(r) as rel, s, count(s) as amount
                          WHERE
                            amount > 1
                          RETURN
                            s.str as term, s.label as label, rel, amount`,

                "params": {
                  "_CUI_": body
                },

                "lean": true
            }

            db.cypher(cypherObj, function(err, res) {
                if (err) {
                    console.log(err);
                    callback(false, []);
                }
                else {
                    callback(false, res);
                }
            });
        }
    }



    // Group terms by label / language
    var terms = {};

    for (var i=0; i < found_terms.length; i++) {
        var t = found_terms[i];
        var key = "custom";


        if (t.hasOwnProperty("label")) {
            key = t["label"].toLowerCase();
        }
        else if (t.hasOwnProperty("lang")) {
            key = language_map[t["lang"]] || "custom";
        }


        if (terms.hasOwnProperty(key)) {
            terms[key].push(t["str"]);
        }
        else {
            terms[key] = [ t["str"] ];
        }
    }

    // - Remove empty key/values
    // - Sort terms by their length
    for (var k in terms) {
        if (! terms[k].length) {
            delete terms[k];
        }
        else {
            terms[k] = _.sortBy(terms[k], "length");
        }
    }


    this.body = {
      "category" : getCategory(types),
      "terms"    : terms,
      "uncheck"  : uncheck || []
    };
};

