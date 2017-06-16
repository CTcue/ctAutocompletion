"use strict";

/** Usage

  curl -X POST -H "Content-Type: application/json" -d '{
      "query": "C1306459"
  }' "http://localhost:4080/expand"

*/

const config  = require('../config/config.js');

const string = require("../lib/string");

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



module.exports = function *() {
  var body = this.request.body;
  var cui  = _.get(body, "query") || null;

  if (!cui) {
      this.body = { "terms": [] }
  }

  if (_.isArray(cui)) {
      var result = yield function(callback) {
          elasticClient.search({
              "index" : 'autocomplete',
              "size": 1000,

              "sort": ["_doc"],
              "_source": ["cui", "pref", "str"],

              "body" : {
                  "query" : {
                      "terms" : {
                          "cui" : _.filter(cui)
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
          var terms = {};

          result.forEach(function(s) {
              var key = s._source.cui;

              // Filter long terms (hacky for now)
              if (s._source.str.length > 30) {
                  return;
              }

              if (terms.hasOwnProperty(s._source.cui)) {
                  terms[key].push(s._source.str);
              }
              else {
                  terms[key] = [s._source.str]
              }
          });


          for (var k in terms) {
              terms[k] = _.uniqBy(terms[k], string.compareFn);
          }

          return this.body = terms;
      }

  }
  else {
      var result = yield function(callback) {
          elasticClient.search({
              "index" : 'autocomplete',
              "size": 100,

              "sort": ["_doc"],
              "_source": ["str"],

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
          var terms = result.map(s => s._source.str);

          return this.body = {
              "terms" : _.uniqBy(terms, string.compareFn),
          };
      }
  }


  this.body = { "terms": [] }
};
