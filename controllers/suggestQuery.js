
function * suggestQuery() {
  var query = this.body.query.words();
  var suggestions = [], tmp = {***REMOVED***;

  /*
    Some suggestions can be quite random, so get autocomplete suggestions
    as well.
  */
  if (query.length > 1) {
    tmp = yield autocomplete.words(query, this.params.type, 5);
  ***REMOVED***
  ***REMOVED***
    tmp = yield autocomplete.startsWith(query, this.params.type, 5);
  ***REMOVED***

  if (tmp.hits && tmp.hits.total > 0) {
    suggestions = tmp.hits.hits;
  ***REMOVED***


  // Look for suggestions in the terms
  var alt = yield suggest.match(query, this.params.type);

  if (alt.hits && alt.hits.total > 0) {
***REMOVED*** Get found CUI codes in suggestions
    var added = suggestions.map(function(a) { return a._source.cui ***REMOVED***);

***REMOVED*** Reject already found CUI codes
    var hits = _.reject(alt.hits.hits, function(a) {
      return this.indexOf(a._source.cui) >= 0;
***REMOVED***, added);

    suggestions = suggestions.concat(hits);
  ***REMOVED***

  // Convert Elastic results to our JSON objects
  if (suggestions.length > 0) {
    var set = [];

    for (var i=0, L=suggestions.length; i<L; i++) {
      var terms = suggestions[i]._source.terms;

  ***REMOVED*** Only include reason suggestsions that have the query word in it
      var reason = _.filter(terms, function(str) {
        return str.has(this);
  ***REMOVED***, query[0]);

  ***REMOVED*** Long terms / many words get a score penalty
      var lengthPenalty = terms[0].words().length - 2;
      var score = suggestions[i]._score - lengthPenalty;

      if (score < 2.5)
        continue;

      set.push({
        "_id"    : suggestions[i]._source.cui,
        "str"    : terms[0],
        "score"  : score,
        "reason" : reason
  ***REMOVED***);
***REMOVED***

***REMOVED*** Sort the list by score
    set = _.sortBy(set, function(a){
      return -a.score
***REMOVED***).slice(0, 12);

    return this.body = set;
  ***REMOVED***

  this.body = [];
***REMOVED***
