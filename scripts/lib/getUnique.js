
var _ = require('lodash');
var removeDiacritics = require('./diacritics.js');


// From an SQL (UMLS) result, return the unique strings
// Example @list
//  ["term", "Another term"]
var getUnique = function(list, removeIndications) {
  list = _.map(list, function(str) {
    return removeDiacritics(str);
  ***REMOVED***);

  var wordsInBrackets = [
    "assessment scale",
    "attribute",
    "body structure",
    "cell structure",
    "disorder",
    "syndrome",
    "environment",
    "environment / location",
    "event",
    "finding",
    "disease",
    "foundation metadata concept",
    "morphologic abnormality",
    "navigational concept",
    "observable entity",
    "occupation",
    "organism",
    "person",
    "physical object",
    "procedure",
    "product",
    "qualifier value",
    "record artifact",
    "regime/therapy",
    "situation",
    "situational",
    "context-dependent category",
    "specimen",
    "substance",
    "specify",
    "function",
    "clinical",
    "chronic",
    "chronisch",
    "chemical"
  ];

  // Additional list with all medical words removed
  // Find longest common substrings
  // Add these to the list (if duplicate, the next function removes them)

  var removeWordsInBrackets = new RegExp('\\((' + wordsInBrackets.join('|') + ')\\)', 'gi');

  list = _.map(list, function(str) {
    return str
      .replace(removeWordsInBrackets, '')
      .replace(/-|_|\.|\,|\(\)|\[\]|'s/g, ' ')
      .replace(/\b(NAO|NOS|NEG)\b/gi, '')   // Remove unwanted words
      .replace(/\s{2,***REMOVED***/g, ' ')          ***REMOVED*** Reduce multiple whitespace
      .trim()
  ***REMOVED***);

  list = _.reject(list, function(str) {
    return str.length < 2 || /^\[.\]|-RETIRED-/i.test(str);
  ***REMOVED***);

  // Sort, so unique returns shortest version
  list = _.sortBy(list, function(str) {
    return str.length;
  ***REMOVED***);

  list = _.uniq(list, function(str) {
    return str
      .toLowerCase()
      .trim();
  ***REMOVED***);

  if (typeof removeIndications !== "undefined") {
***REMOVED*** Checks for the uniqueness
***REMOVED*** * Case-, dash-, underscore- insensitive
    var removeWords = new RegExp('(' + wordsInBrackets.join('|') + ')', 'gi');

    var listClone = list.slice()
    listClone = _.map(listClone, function(str) {
      return str
        .replace(removeWords, '')
        .replace(/\(.*\)|\[.*\]/g, '')   // Remove anything in brackets
        .trim()
***REMOVED***);

    list = list.concat(listClone);

    list = _.map(list, function(str) {
      return str
        .replace(/-|_|\.|\,|\(\)|\[\]/g, ' ')
        .replace(/\s{2,***REMOVED***/g, ' ')
        .replace(/\b[a-z]\b/gi, ' ')   ***REMOVED*** Remove single characters (weird UMLS thing)
        .toLowerCase()
        .trim()
***REMOVED***);

    list = _.uniq(list);
  ***REMOVED***

  return list;
***REMOVED***
module.exports = getUnique;
