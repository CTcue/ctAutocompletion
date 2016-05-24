"use strict";

/** Usage

    curl -X POST -d '{
        "query": "C0006826"
    }' "https://ctcue.com/umls/related"

*/

const config  = require('../config/config.js');
const _ = require("lodash");
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


module.exports = function *() {
    var result = {
        "children": [],
        "parents" : [],
        "siblings": []
    };

    var params = this.request.body.query;

    if (!config.neo4j["is_active"]) {
        return this.body = result;
    }

    // var children = yield _cypher(params, __children);
    // var parents  = yield _cypher(params, __parents);
    // var siblings = yield _cypher(params, __siblings);

    for (let cui of yield _cypher(params, __children)) {
        var item = yield _elastic(cui);

        if (item) {
            result["children"].push(item)
        }
    }

    for (let cui of yield _cypher(params, __parents)) {
        var item = yield _elastic(cui);

        if (item) {
            result["parents"].push(item)
        }
    }

    for (let cui of yield _cypher(params, __siblings)) {
        var item = yield _elastic(cui);

        if (item) {
            result["siblings"].push(item)
        }
    }

    this.body = result;
};


function _cypher(params, fn) {
    var query = fn(params)
    var cypherObj = {
        "query"  : query,
        "params" : {
            "A": params,
        },
        "lean": true
    }

    return function(callback) {
        db.cypher(cypherObj, function(err, paths) {
            if (err) {
                // console.log(err);
                return callback(false, [])
            }

            if (!paths || paths.length < 1 || !_.has(paths[0], "list")) {
                return callback(false, []);
            }

            callback(null, paths[0]["list"].map(s => s["cui"]));
        });
    }
}


function __parents(cui) {
    return `MATCH (t1:Concept { cui: {A} }), (t1)-[:child_of]->(p) return COLLECT(p) as list`
}

function __children(cui) {
    return `MATCH (t1:Concept { cui: {A} }), (t1)<-[:child_of]-(c) return COLLECT(c) as list`
}

function __siblings(cui) {
    return `MATCH (t1:Concept { cui: {A} }), (t1)-[:sibling_of]-(s) return COLLECT(s) as list`
}



function _elastic(cui) {
    return function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "size": 1, // Only need the preferred term for now
            "_source": ["pref"],
            "body" : {
                "query" : {
                    "term" : { "cui" : cui }
                 }
            }
        },
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits;

                // Return ES source part only
                if (hits.length > 0) {
                    return callback(false, { "cui": cui, "pref": hits[0]._source.pref });
                }
            }

            callback(false, false);
        });
    }
}