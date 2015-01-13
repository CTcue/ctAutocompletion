
var _ = require('lodash');
var sift = require('sift-string');

// Sort a list so that items that match the term are first
var bestMatch = function(list, term) {
  if (list.length === 0) {
    return [];
  ***REMOVED***
  else if (list.length === 1) {
    return list[0];
  ***REMOVED***
  ***REMOVED***
    var scores = list.map(function(str) {
      console.log(str, sift(str, term));
      return sift(str, term);
***REMOVED***);
  ***REMOVED***

  return list[0];
***REMOVED***
module.exports = bestMatch;