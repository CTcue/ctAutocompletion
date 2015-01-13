
var _    = require('lodash');
var utf8 = require('utf8');

var removeDiacritics = require('./diacritics.js');

// From an SQL (UMLS) result, return the unique strings
// Example @list
//  ["term", "Another term"]
module.exports = function(list) {
  var rejectPattern = /\(.*\)|\[X\]|NOS|NAO|-RETIRED-/;

  list = _.map(list, function(str) {
    try {
      str = utf8.decode(str);
      return removeDiacritics(str);
    }
    catch (err) {
      return "";
    }
  });

  list = _.reject(list, function(str) {
    return rejectPattern.test(str);
  });

  list = _.uniq(list, function(str) {
    return str.toLowerCase().replace('-', ' ').replace('\'s', 's');
  });

  return list;
}
