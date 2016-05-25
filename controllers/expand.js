"use strict";

/** Usage

  curl -X POST -H "Content-Type: application/json" -d '{
      "query": "C1306459"
  }' "http://localhost:4080/expand"

*/

const config  = require('../config/config.js');
const getCategory = require("./lib/category.js");

const _ = require("lodash");
const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
    }
  ]
});


const source = ["str", "types"];


module.exports = function *() {

  var result = yield function(callback) {
      elasticClient.search({
          "index" : 'autocomplete',
          "size": 100,

          "_source": source,

          "body" : {
              "query" : {
                  "term" : {
                      "cui" : this.request.body.query
                   }
               }
          }
      },
      function(err, resp) {
          if (resp && !!resp.hits && resp.hits.total > 0) {
              callback(false, resp.hits.hits);
          }
          else {
              callback(err, []);
          }
      });
  };

  if (result && result.length > 0) {
      var types = result[0]._source.types;
      var terms = result.map(s => s._source.str);

      return this.body = {
          "DEPRECATED": true,
          "category" : types,
          "terms"    : _.uniq(terms, s => normalizeTextForComparison(s)),
      };
  }

  this.body = { "DEPRECATED": true, "category": null, "terms": [] }
};


function normalizeTextForComparison(text) {
    if (!text) {
        return "";
    }

    return text
        .toLowerCase()
        .replace(/[^\w]/g, ' ') // symbols etc
        .replace(/\s\s+/g, ' ') // multi whitespace
        .trim()
}
