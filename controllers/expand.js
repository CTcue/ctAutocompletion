
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
***REMOVED***);

module.exports = function *() {
  var result = yield function(callback) {
      elasticClient.search({
          "index" : 'autocomplete',
          "type"  : 'records',
          "size": 100,

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

  var types = result[0]._source.types;

  this.body = {
    "type": "-",
    "category": typeToCategory(types),
    "terms": result.map(function(item) { return item._source.str; ***REMOVED***)
  ***REMOVED***;
***REMOVED***;


//////
// TODO
// Simple machine learning algo: Based on types -> give statistically most likely category
// Example: Calcium has types
// [ 'substance',
// 'Biologically Active Substance',
// 'Element, Ion, or Isotope',
// 'Chemical/Ingredient',
// 'Pharmacologic Substance',
// 'medication' ]
//
// And given Chemical/Ingredient and substance it's most likely a labresult.


function typeToCategory(types) {
    if (!types || typeof types === "undefined" || types.length === 0) {
        return "diagnosis";
***REMOVED***

    var medication = ["medication", "Pharmacologic Substance", "product"]
    var labresult  = ["Finding", "Laboratory Procedure", "Chemical/Ingredient"]

    return inList(types, medication, "medication") ||
           inList(types, labresult, "labresult") ||
           "diagnosis";
***REMOVED***

function inList(haystack, search, type) {
    for (var i=0; i<search.length; i++) {
          if (haystack.indexOf(search[i]) >= 0) {
              return type;
      ***REMOVED***
***REMOVED***

    return false;
***REMOVED***
