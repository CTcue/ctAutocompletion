
// Looks for edge n-gram word matches
exports.expandCUI = function(query) {
  var lookup = {
    "_source" : ["cui", "terms"],
    "query": {
      "match": {
        "cui": query.toUpperCase()
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  return function(callback) {
    reqClient.post("_search?size=1", lookup, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***

module.exports = function *() {
  var suggestions = yield autocomplete.expandCUI(this.body.query);

  if (suggestions.hits && suggestions.hits.hits) {
    var hit = suggestions.hits.hits[0]._source;

    this.body = {
      'cui'   : hit.cui,
      'terms' : hit.terms,
      'type'  : suggestions.hits.hits[0]._type
***REMOVED***
  ***REMOVED***
  ***REMOVED***
    this.body = {***REMOVED***;
  ***REMOVED***
***REMOVED***
