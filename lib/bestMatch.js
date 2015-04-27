
var _ = require('lodash');
var sift = require('sift-string');

// Sort a list so that items that match the term are first
var bestMatch = function(list, term) {
  if (list.length === 0) {
    return [];
  }
  else if (list.length === 1) {
    return list[0];
  }
  else {
    var scores = list.map(function(str) {
      return sift(str, term);
    });
  }

  return list[0];
}
module.exports = bestMatch;