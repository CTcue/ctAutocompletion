
var _ = require('lodash');

// Sort a list so that items that match the term are first
var bestMatch = function(list, term) {
  if (list.length === 0) {
    return [];
  }
  else if (list.length === 1) {
    return list[0];
  }
  else {

  }

  return list[0];
}
module.exports = bestMatch;