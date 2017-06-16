"use strict";

const config  = require('../config/config.js');

const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
    }
  ]
});


const CUI_SOURCES = ["str", "lang", "types", "pref"];


exports.getTermsByCui = function(cui, size) {
    if (typeof size === "undefined") {
        size = 60;
    }


    return function(callback) {
        if (!cui) {
            return callback(false, false);
        }

        elasticClient.search({
            "index": 'autocomplete',
            "size": size,
            "sort": ["_doc"],
            "_source": CUI_SOURCES,

            "body" : {
                "query" : {
                    "term" : {
                        "cui" : cui
                     }
                 }
            }
        },
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits;

                // Return ES source part only
                if (hits.length > 0) {
                    var types = hits[0]._source.types;
                    var pref  = hits[0]._source.pref;

                    return callback(false, [types, pref, hits.map(s => s._source)]);
                }
            }
            else {
                callback(false, false);
            }
        });
    };
}
