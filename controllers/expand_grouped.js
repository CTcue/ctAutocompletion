
var _ = require("lodash");

var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
***REMOVED***);

var getCategory = require("./lib/category.js");

const source = ["str", "lang", "types"];
const language_map = {
  "DUT" : "dutch",
  "ENG" : "english",
  "default": "custom"
***REMOVED***;

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
      var types = result[0]._source.types;

      var terms = {
          "english" : [],
          "dutch"   : [],
          "custom"  : []
  ***REMOVED***;

  ***REMOVED*** Group terms by language
      for (var i=0; i < result.length; i++) {
          var lang = result[i]["_source"]["lang"];

          if (! language_map.hasOwnProperty(lang)) {
              lang = "default";
      ***REMOVED***

          terms[language_map[lang]].push(result[i]["_source"]["str"]);
  ***REMOVED***


  ***REMOVED*** - Remove empty key/values
  ***REMOVED*** - Sort terms by their length
      for (var k in terms) {
          if (! terms[k].length) {
              delete terms[k];
      ***REMOVED***
          ***REMOVED***
              terms[k] = _.sortBy(terms[k], "length");
      ***REMOVED***
  ***REMOVED***


      return this.body = {
        "category"  : getCategory(types),
        "terms"     : terms
  ***REMOVED***;
  ***REMOVED***

  this.body = { "type": "", "category": "", "terms": [] ***REMOVED***
***REMOVED***;
