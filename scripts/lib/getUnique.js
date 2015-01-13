
var _ = require('lodash');
var removeDiacritics = require('./diacritics.js');

// From an SQL (UMLS) result, return the unique strings
// Example @list
//  ["term", "Another term"]
module.exports = function(list) {
  var rejectPattern = /\(.*\)|\[X\]|-RETIRED-/;

  list = _.map(list, function(str) {
    return removeDiacritics(str);
  });

  list = _.reject(list, function(str) {
    return str.length === 0 || rejectPattern.test(str);
  });

  list = _.uniq(list, function(str) {
    return str.toLowerCase().replace('-', ' ').replace('\'s', 's');
  });

  return list;
}
