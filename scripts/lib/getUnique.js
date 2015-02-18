
var _ = require('lodash');
var removeDiacritics = require('./diacritics.js');

// From an SQL (UMLS) result, return the unique strings
// Example @list
//  ["term", "Another term"]
var getUnique = function(list) {
  list = _.map(list, function(str) {
    return removeDiacritics(str);
  });

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

  var removeRegex = new RegExp('\\b(' + wordsInBrackets.join('|') + '|stage|stadium|ziekte van|niet gespecificeerde?|unspecified|undefined|NAO|NOS|NEG|Ambiguous)\\b', 'gi');

  // Clone list
  listClone = list.slice()
  listClone = _.map(listClone, function(str) {
    return str
      .replace(/\(.*\)|\[.*\]|,/g, '')   // Remove anything in brackets
      .replace(/-|_/g, ' ')              // Remove dashes
      .replace(/\b[a-z]\b/gi, ' ')       // Remove single characters (weird UMLS thing)
      .replace(removeRegex, '')          // Remove unneeded words
      .trim()
  });

  // Remove short words and terms that are deleted (but still in UMLS)
  list = _.reject(list.concat( _.uniq(listClone) ), function(str) {
    return str.length < 4 || /^\[.\]|-RETIRED-/i.test(str);
  });

  // Sort, so unique returns shortest version
  list = _.sortBy(list, function(str) {
    return str.length;
  });

  // Checks for the uniqueness
  // * Case-, dash-, underscore- insensitive
  // * Medical skip words (NOS, NAO) may be left out
  var duplicateRegex = new RegExp('\((' + wordsInBrackets.join('|') + ')\)|NAO|NOS|NEG|unspecified|undefined|Ambiguous', 'gi');
  list = _.uniq(list, function(str) {
    return str
      .replace(duplicateRegex, '')
      .replace(/-|_|\.|\,|\(\)|\[\]/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .toLowerCase()
      .trim();
  });

  return list;
}
module.exports = getUnique;
