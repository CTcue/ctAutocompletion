
const _ = require("lodash");
const config  = require("../config/config.js");

const elastic = require("elasticsearch");
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": "localhost",
      "auth": config.elasticsearch.auth
    }
  ]
});


module.exports = function *() {
    var term = _.get(this.request.body, "query") || null;

    if (! term || term.length < 2) {
        this.body = [];
        return;
    }

    // Clean input term
    var clean = _.deburr(term)     // remove accents
      .toLowerCase()               // lowercase
      .replace(/[^a-z0-9\* ]/g, " ") // remove symbols
      .replace(/\s+/g, " ")        // reduce spaces
      .trim();

    var res_treatments = yield getTreatments(clean);
    var res_specialism = [];

    // If hardly anything is found, check if person is (accidentaly) inserting a specialism
    if (res_treatments.length < 5) {
        res_specialism = yield getSpecialism(clean);
    }

    this.body = [].concat(res_specialism, res_treatments);
}


function getSpecialism(clean) {
    var letters = clean.replace(/[0-9]/g, "").trim()
    var parts = clean.split(" ");
    var expanded = parts.map(s => s + "*").join(" ");

    return function(callback) {
        if (!letters.length) {
            callback(false, []);
        }

        elasticClient.search({
          "index" : "dbc_zorgproduct",
          "type"  : ["specialism", "diagnosis"],

          "size"  : 5,
          "min_score": 2,

          "body" : {
              "query" : {
                  "bool": {
                      "must": [
                          {
                              "prefix" : {
                                  "label": letters.split(" ")[0]
                              }
                          }
                      ],

                      "should": [
                          {
                              "query_string" : {
                                  "query": expanded,
                                  "default_operator": "AND",
                                  "phrase_slop": 0,
                                  "fuzziness": 0,
                                  "enable_position_increments": false,
                                  "fields": ["label", "specialism"]
                              }
                          }
                      ]
                  }

              }
          }
        },
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits || [];

                var sources = hits.map(function(s) {
                    var base = {
                        "_type": s["_type"],
                    };

                    return _.extend(base, s["_source"]);
                });

                callback(false, sources);
            }
            else {
                callback(false, []);
            }
        });
    };
}


function getTreatments(clean) {
      // Skip digits in phrase query
      var phrase = clean.replace(/[0-9\*]/g, "").trim();

      // Create "keywords"
      var keywords = clean
          .replace(/\b(and|or|de|het|een)\b/g, " ")  // remove stop words
          .replace(/\s+/g, " ")        // reduce spaces
          .trim()
          .split(" ");

      // Create "term expansions"
      var expanded = keywords.map(function(s) {
          if (_.includes(s, "*")) {
              return s;
          }
          else {
              return s + "*";
          }
      }).join(" ");


      // Base query
      // - Include phrase part for normal description to boost natural language
      var queryBody = {
        "query" : {
            "bool": {
                "must": [],

                "should": [
                    {
                        "match_phrase_prefix" : {
                            "description": phrase
                        }
                    },

                    {
                        "query_string" : {
                            "boost": 2,
                            "query": expanded,
                            "default_operator": "AND",
                            "phrase_slop": 1,
                            "fields": ["description", "description_latin", "product_code"]
                        }
                    }
                ]
            }
        }
    };

    // If first word is part of code:
    // - make sure we have the product_code part
    if (/^[\d\*]+$/.test(keywords[0])) {
        queryBody.query.bool.must.push({
            "query_string" : {
                "query": expanded.split(" ")[0],
                "phrase_slop": 0,
                "fields": [ "product_code" ]
            }
        });
    }

    // For every long keyword, allow them to be fuzzy
    for (var i=0; i < keywords.length; i++) {
        var t = keywords[i].replace(/[^a-z]/g, "").trim();

        if (!t.length || t.length < 8) {
            continue;
        }

        queryBody.query.bool.should.push({
            "fuzzy" : {
                "description_latin": {
                    "value"         : keywords[i],
                    "prefix_length" : 3,
                    "max_expansions": 100
                }
            }
        });
    }

    // Finally, build query and return results;
    return function(callback) {
        elasticClient.search({
          "index" : "dbc_zorgproduct",
          "type"  : "treatments",
          "size"  : 15,
          "body" : queryBody,
        },
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits || [];

                var sources = hits.map(function(s) {
                    var base = {
                        "_type": s["_type"],
                    };

                    var short_description = _.get(s, "_source.description_latin") || null;

                    if (short_description) {
                        if (short_description.length < 3) {
                            s._source.short_description = short_description.join(" | ");
                        }
                        else {
                            s._source.short_description = short_description.slice(0, 3).join(" | ")
                        }
                    }
                    else {
                        s._source.short_description = "...";
                    }

                    return _.extend(base, s["_source"]);
                });

                callback(false, sources);
            }
            else {
                callback(false, []);
            }
        });
    };
}
