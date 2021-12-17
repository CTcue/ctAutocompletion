
const config  = require("../config/config.js");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
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
            "index": "autocomplete",
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
        function(err, esRes) {
            const resp = esRes.body;

            if (resp && resp.hits && resp.hits.hits && resp.hits.hits.length) {
                const hits = resp.hits.hits;

                // Return ES source part only
                if (hits.length > 0) {
                    const types = hits[0]._source.types;
                    const pref  = hits[0]._source.pref;

                    return callback(false, [types, pref, hits.map(s => s._source)]);
                }
            }
            else {
                callback(false, false);
            }
        });
    };
}
