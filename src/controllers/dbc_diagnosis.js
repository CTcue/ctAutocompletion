"use strict";

const _ = require("lodash");
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


// Autocomplete specialism diagnosis (given specific code)

module.exports = function *() {
    var specialty_code = this.params.code;

    if (! specialty_code || specialty_code.length < 2) {
        return this.body = [];
    }

    var result = yield function(callback) {
        elasticClient.search({
          "index" : 'dbc_zorgproduct',
          "type": "diagnosis",
          "size": 500,

          "body" : {
              "query" : {
                  "term" : {
                      "specialism" : specialty_code
                   }
               }
          }
        },
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits;
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
                callback(err, []);
            }
        });
    };

    this.body = result;
}
