
var sugar        = require('sugar');
var _            = require('lodash');

// Select -best- match for each payload 
function suggestionsFromElasticRecords(set, query) {
  set = payloadMatchesByTerm(set, query);

  // Generate bins that sort on length and match close to given query 
  set = binsFromSet(set, query);
  set = reduceBins(set, query);

  return set;
***REMOVED***;
exports.suggestionsFromElasticRecords = suggestionsFromElasticRecords;

function binsFromSet(set, term) {
  return _.groupBy(set, function(a) {
    var N = a.str.length - this.length;

    if      (N <= 8)  return 0;
    else if (N <= 13) return 1;
    else if (N <= 18) return 2;
    else if (N <= 27) return 3;
    else              return 4;

  ***REMOVED***, term);
***REMOVED***
exports.binsFromSet = binsFromSet;

// For the bins, put terms that start with the query first
// and skip entries in the last bin
function reduceBins(bins, query) {
  return _.reduce(bins, function(result, v, k) {
    var list = sortByStartsWith(v, this);

    if (typeof result == 'undefined')
      return list;
    else 
      return result.concat(list);

  ***REMOVED***, [], query);
***REMOVED***
exports.reduceBins = reduceBins;

// For each item in a set of CUI and multiple STR 
// select -one- STR that best matches given term
function payloadMatchesByTerm(set, term) {
  var tmp = [];

  // For each entry, get the CUI+STR that most matches the query
  for (var i in set) {
    tmp[i] = {
      '_id' : set[i].cui
***REMOVED***;

***REMOVED*** Remove options that do not match the query
    var filtered = filterByStartsWith(set[i].codes, term);

    if (filtered.length > 0) {
      tmp[i].str = _.sortBy(filtered, 'length')[0];
***REMOVED***
    ***REMOVED***
      filtered = filterByStartsWith(set[i].codes, term.slice(0, Math.floor(term.length*0.5)));

      if (filtered.length > 0) {
        tmp[i].str = _.sortBy(filtered, 'length')[0];
  ***REMOVED***
      ***REMOVED***
        tmp[i].str = set[i].codes[0];
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  return tmp;
***REMOVED***
exports.payloadMatchesByTerm = payloadMatchesByTerm;


// Returns a list containing the items starting with given term 
function filterByStartsWith(list, term) {
  return _.filter(list, function(str) {
    return str.startsWith(this);
  ***REMOVED***, term);
***REMOVED***
exports.filterByStartsWith = filterByStartsWith;


// Sort a list so that items that match the term are first
function sortByStartsWith(list, term) { 
  if (list.length <= 1)
    return list;

  list = _.groupBy(list, function(obj) {
    return obj.str.startsWith(this);
  ***REMOVED***, term);

  if (!!list['true'] && !!list['false'])
    return list['true'].concat(list['false']);
  else if (!!list['true'])
    return list['true'];
  else
    return list['false'];
***REMOVED***
exports.sortByStartsWith = sortByStartsWith;
