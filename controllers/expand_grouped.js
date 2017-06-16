"use strict";

/** Usage

  curl -X POST -H "Content-Type: application/json" -d '{
      "query": "C1306459"
  }' "http://localhost:4080/expand-grouped"

*/


const config  = require('../config/config.js');
const neo4j = require('neo4j');
const _ = require("lodash");
const string = require("../lib/string");
const queryHelper = require("../lib/queryHelper");
const getCategory = require("../lib/category");

const db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
});


const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
    }
  ]
});



const language_map = {
    "DUT" : "dutch",
    "ENG" : "english"
};



module.exports = function *(next) {
    var cui = this.request.body.query || "";

    var result      = yield queryHelper.getTermsByCui(cui, 100);
    var pref        = "";
    var types       = [];
    var found_terms = [];

    if (result) {
        types       = result[0];
        pref        = result[1];
        found_terms = result[2];

        // Get unique terms per language
        found_terms = _.uniq( _.sortBy(found_terms, "lang"), s => string.compareFn(s.str) );
    }


    // Check for user contributions
    // - If the current user added custom concepts/synonyms
    // if (config.neo4j["is_active"]) {
    //     if (this.user) {
    //         var user_contributed = yield function(callback) {
    //             var cypherObj = {
    //                 "query": `MATCH
    //                             (s:Synonym {cui: {_CUI_} })<-[r:LIKES]-(u:User { id: { _USER_ }, env: { _ENV_ } })
    //                           RETURN
    //                             s.str as str, s.label as label`,

    //                 "params": {
    //                     "_CUI_"  : body,
    //                     "_USER_" : this.user._id,
    //                     "_ENV_"  : this.user.env
    //                 },

    //                 "lean": true
    //             }


    //             db.cypher(cypherObj, function(err, res) {
    //                 if (err) {
    //                     console.error(err);
    //                     callback(false, []);
    //                 }
    //                 else {
    //                     callback(false, res);
    //                 }
    //             });
    //         }

    //         // Add user contributions
    //         if (user_contributed && user_contributed.length) {
    //             found_terms = found_terms.concat(user_contributed);
    //         }
    //     }


    //     // Check if anyone (any user) has unchecked concepts/synonyms
    //     // - Need more than 1 "downvote"
    //     var uncheck = yield function(callback) {
    //         var cypherObj = {
    //             "query": `MATCH
    //                         (s:Synonym {cui: {_CUI_} })<-[r:DISLIKES]-(u:User)
    //                       WITH
    //                         type(r) as rel, s, count(s) as amount
    //                       WHERE
    //                         amount > 1
    //                       RETURN
    //                         s.str as term, s.label as label, rel, amount`,

    //             "params": {
    //               "_CUI_": body
    //             },

    //             "lean": true
    //         }

    //         db.cypher(cypherObj, function(err, res) {
    //             if (err) {
    //                 console.info(err);
    //                 callback(false, []);
    //             }
    //             else {
    //                 callback(false, res);
    //             }
    //         });
    //     }
    // }



    // Group terms by label / language
    var terms = {};

    for (var i=0; i < found_terms.length; i++) {
        var t = found_terms[i];
        var key = "custom";

        // Skip two letter abbreviations
        if (!t["str"] || t["str"].length < 3) {
            continue;
        }

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
            var unique = _.uniqBy(terms[k], s => string.forComparison(s));
            terms[k]   = _.sortBy(unique, "length");
        }
    }


    this.body = {
      "category" : getCategory(types),
      "pref"     : pref,
      "terms"    : terms,
      "uncheck"  : []
    };


    // For logging
    this.pref_term = pref;
    yield next;
};
