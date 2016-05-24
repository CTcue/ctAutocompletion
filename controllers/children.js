"use strict";

/** Usage

    curl -X POST -d '{
        "query": "C0006826"
    }' "https://ctcue.com/umls/children"

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
    var params = this.request.body.query;

    if (!config.neo4j["is_active"]) {
        return this.body = {};
    }

    var cypherObj = buildCypherObj(params);

    var children = yield function(callback) {
        db.cypher(cypherObj, function(err, paths) {
            if (err) {
              console.log(err);
              return callback(false, [])
            }

            if (!paths || paths.length < 1 || !_.get(paths[0], "children")) {
                return callback(false, []);
            }

            callback(null, paths[0]["children"].map(s => s["cui"]));
        });
    };

    var result = [];

    for (var i=0; i < children.length; i++) {
        var lookup = yield function(callback) {
            elasticClient.search({
                "index" : 'autocomplete',
                "size": 1, // Only need the preferred term for now
                "_source": ["pref"],
                "body" : {
                    "query" : {
                        "term" : {
                            "cui" : children[i]
                         }
                     }
                }
            },
            function(err, resp) {
                if (resp && !!resp.hits && resp.hits.total > 0) {
                    var hits = resp.hits.hits;

                    // Return ES source part only
                    if (hits.length > 0) {
                        var pref  = hits[0]._source.pref;
                        var types = hits[0]._source.types;

                        return callback(false, { "cui": children[i], "pref": pref });
                    }
                }

                callback(false, false);
            });
        }

        if (lookup) {
            result.push(lookup)
        }
    }

    this.body = result;
};


function buildCypherObj(cui) {
    return {
        "query"  : buildQuery(cui),
        "params" : {
            "A": cui,
        },
        "lean": true
    };
}

function buildQuery(cui) {
    return `MATCH (t1:Concept { cui: {A} }), (t1)<-[:child_of]-(c) return COLLECT(c) as children`
}