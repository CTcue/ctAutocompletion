
var _ = require('lodash');
var removeDiacritics = require('./diacritics.js');

// From an SQL (UMLS) result, return the unique strings
// Example @list
//  ["term", "Another term"]
var getUnique = function(list) {
  var rejectPattern = /\(.*\)|\[X\]|-RETIRED-/;

  list = _.map(list, function(str) {
    return removeDiacritics(str);
  ***REMOVED***);

  list = _.reject(list, function(str) {
    return str.length === 0 || rejectPattern.test(str);
  ***REMOVED***);

  // Checks for the uniqueness
  // * Case-, dash-, underscore- insensitive
  // * Medical skip words (NOS, NAO) may be left out
  list = _.uniq(list, function(str) {
    return str
      .replace(/,|NOS|NAO/g, '')
      .replace(/_|-/g, ' ')
      .replace('\'s', 's')
      .toLowerCase()
      .trim();
  ***REMOVED***);

  return list;
***REMOVED***
module.exports = getUnique;


// Do test cases
if (typeof process.argv[2] !== 'undefined' && process.argv[2] === "test") {
  var cases = [
    [
      "Malignant tumor of mesopharynx",
      "Malignant tumour of mesopharynx",
      "Malignant tumour of mesopharynx, NOS",
      "Malignant tumour of mesopharynx (disorder)",
      "Malignant tumour of mesopharynx (syndrome)",
    ],
    [
      "Ankylosing spondylitis",
      "Bekhterevs disease",
      "Bekhterev's disease",
      "Marie-Strumpell spondylitis",
      "Marie Strumpell spondylitis",
    ]
  ];

  for (var i=0; i < cases.length; i++) {
    console.log(cases[i]);
    console.log("Unique : ", getUnique(cases[i]));
    console.log("------------");
  ***REMOVED***
***REMOVED***;
