"use strict";

/** Usage

  curl -X POST -H "Content-Type: application/json" -d '{
      "query": "C1306459"
  ***REMOVED***' "http://localhost:4080/expand"

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
***REMOVED***
  ]
***REMOVED***);



module.exports = function *() {
  var body = this.request.body;
  var cui  = _.get(body, "query") || null;

  if (!cui) {
      this.body = { "terms": [] ***REMOVED***
  ***REMOVED***

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
                  ***REMOVED***
              ***REMOVED***
          ***REMOVED***
      ***REMOVED***,
          function(err, resp) {
              if (resp && !!resp.hits && resp.hits.total > 0) {
                  callback(false, resp.hits.hits);
          ***REMOVED***
              ***REMOVED***
                  callback(err, []);
          ***REMOVED***
      ***REMOVED***);
  ***REMOVED***;

      if (result && result.length > 0) {
          var terms = {***REMOVED***;

          result.forEach(function(s) {
              var key = s._source.cui;

          ***REMOVED*** Filter long terms (hacky for now)
              if (s._source.str.length > 30) {
                  return;
          ***REMOVED***

              if (terms.hasOwnProperty(s._source.cui)) {
                  terms[key].push(s._source.str);
          ***REMOVED***
              ***REMOVED***
                  terms[key] = [s._source.str]
          ***REMOVED***
      ***REMOVED***);


          for (var k in terms) {
              terms[k] = _.uniqBy(terms[k], string.compareFn);
      ***REMOVED***

          return this.body = terms;
  ***REMOVED***

  ***REMOVED***
  ***REMOVED***
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
                   ***REMOVED***
               ***REMOVED***
          ***REMOVED***
      ***REMOVED***,
          function(err, resp) {
              if (resp && !!resp.hits && resp.hits.total > 0) {
                  callback(false, resp.hits.hits);
          ***REMOVED***
              ***REMOVED***
                  callback(err, []);
          ***REMOVED***
      ***REMOVED***);
  ***REMOVED***;

      if (result && result.length > 0) {
          var terms = result.map(s => s._source.str);

          return this.body = {
              "terms" : _.uniqBy(terms, string.compareFn),
      ***REMOVED***;
  ***REMOVED***
  ***REMOVED***


  this.body = { "terms": [] ***REMOVED***
***REMOVED***;
