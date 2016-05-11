"use strict";

var _ = require("lodash");
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client();

const source = ["code", "diagnose"];


module.exports = function *() {
    var specialty_code = this.params.specialty_code;

    if (! specialty_code || specialty_code.length < 2) {
        return this.body = [];
    }

    var result = yield function(callback) {
        elasticClient.search({
          "index" : 'dbc_zorgproduct',
          "size": 1000,
          "_source": source,

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
                        "label"  : s["_source"]["diagnose"],
                        "number" : s["_source"]["code"]
                    }
                });

                callback(false, _.sortBy(sources, "number"));
            }
            else {
                callback(err, []);
            }
        });
    };


    this.body = result;
}