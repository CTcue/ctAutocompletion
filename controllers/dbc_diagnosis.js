
const _ = require("lodash");
const config  = require("../config/config.js");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});


// Autocomplete specialism diagnosis (given specific code)

module.exports = function *() {
    var specialty_code = this.params.code;

    if (! specialty_code || specialty_code.length < 2) {
        return this.body = [];
    }

    var result = yield function(callback) {
        elasticClient.search({
          "index" : "dbc_zorgproduct",
          "type": "_doc",
          "size": 500,

          "body" : {
              "query" : {
                  "term" : {
                      "specialism" : specialty_code
                   }
               }
          }
        },
        function(err, esRes) {
            var res = esRes.body;
            if (res && !!res.hits && res.hits.total > 0) {
                var hits = res.hits.hits;
                var sources = hits.map(function(s) {
                    return {
                        "label"  : s["_source"]["label"],
                        "number" : s["_source"]["code"]
                    }
                });

                // Sort the DBC codes
                sources = _.sortBy(sources, "number");
                sources = _.uniq(sources, function(s) {
                    if (!s || !s.hasOwnProperty("number")) {
                        return false;
                    }

                    return s["number"].replace(/^0+/, "");
                });

                callback(false, sources);
            }
            else {
                callback(false, []);
            }
        });
    };

    this.body = result;
}
