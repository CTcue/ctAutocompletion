"use strict";

/** Usage

  curl -X POST -H "Content-Type: application/json" -d '{
      "query": "C1306459"
  }' "http://localhost:4080/expand-by-string"

*/

const config  = require('../config/config');

const _ = require("lodash");
const string = require("../lib/string");
const queryHelper = require("../lib/queryHelper");

const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase({
    "url": 'http://localhost:7474',
    "auth": config.neo4j
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
    var body = this.request.body;

    var term = _.get(body, "query") || null;
    var category = _.get(body, "category") || "keyword";


    if (!term || term.length < 3) {
        this.body = null;
        return;
    }


    // Exact term is indexed without dashes
    var wantedTerm = term
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    var queryObj = {
        "index" : "autocomplete",
        "size"  : 1,

        "body": {
            "query": {
                "term" : {
                    "exact" : wantedTerm
                }
            }
        }
    };

    var cuiResult = yield function(callback) {
        elasticClient.search(queryObj, function(err, resp) {
            if (err) {
                callback(false, false);
            }

            callback(false, _.get(resp, "hits.hits.0._source") || false);
        });
    };


    if (!cuiResult) {
        this.body = null;
        return;
    }


    var result      = yield queryHelper.getTermsByCui(_.get(cuiResult, "cui"));
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


    // Group terms by label / language
    var terms = {
        "custom"   : [],
        "suggested": []
    };

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
            terms[key] = [t["str"]];
        }
    }


    // ------------
    // Check Neo4j for suggestions
    // - brands / related_brands / siblings etc.
    // if (config.neo4j["is_active"] && _.get(cuiResult, "cui")) {
    //     var cui = _.get(cuiResult, "cui");

    //     var extra = yield findSuggestions(cui, { "brands": [], "related_brands": [] });

    //     terms = _.extend(terms, extra);
    // }



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
      "cui"      : _.get(cuiResult, "cui") || null,
      "pref"     : pref,
      "terms"    : terms,
      "uncheck"  : []
    };

    // For logging
    this.pref_term = pref;
    yield next;
};


const queries  = require("./_cypher/queries");
const _cypher  = require("./_cypher/cypher");
const _elastic = require("./_cypher/expand_by_cui");

const neoQuery = {
    "children"  : queries.__children(),
    "brands"    : queries.__brands(),
    "related_brands": queries.__related_brands(),
    "siblings"  : queries.__siblings(),
};


function * findSuggestions(findBy, result) {
    if (_.isEmpty(result)) {
        var result = {
            // "children": [],
            // "siblings": [],
            "brands" : []
        };
    }

    // var result = {
    //     "children": [],
    //     "siblings": [],
    //     "brands"  : []
    // };

    // Obtain given "cui" parameter
    // var body = this.request.body.query;
    var params = {
        "A": findBy,
    };

    for (var k in result) {
        if (!_.has(neoQuery, k)) {
            continue;
        }

        for (let cui of yield _cypher(params, neoQuery[k])) {
            var item = yield _elastic(cui);

            if (item && _.has(item, "pref")) {
                result[k].push(item.pref)
            }
        }
    }

    return result;
};





function buildQuery(cui) {
    // return `MATCH (t1:Concept { cui: {A} }),
    //     (t1)<-[:child_of]-(c)
    //         return COLLECT(distinct c) as children`

    // Too much results if brands are included

    return `MATCH (t1:Concept { cui: {A} }),
        (t1)<-[:child_of]-(c),
        (t1)<-[:brand]-(b)
            return COLLECT(distinct c) as children,
                   COLLECT(distinct b) as brands`

    // return `MATCH (t1:Concept { cui: {A} }),
    //     (t1)<-[:child_of]-(c)
    //         return COLLECT(distinct c) as children`


    // return `MATCH (t1:Concept { cui: {A} }),
    //     (t1)<-[:brand]-(b)
    //         return COLLECT(distinct b) as brands`
}
