
// Looks for edge n-gram word matches
exports.expandCUI = function(query) {
  var lookup = {
    "_source" : ["cui", "terms"],
    "query": {
      "match": {
        "cui": query.toUpperCase()
      }
    }
  };

  return function(callback) {
    reqClient.post("_search?size=1", lookup, function(err, res, body) {
      callback(err, body);
    });
  };
}

module.exports = function *() {
  var suggestions = yield autocomplete.expandCUI(this.body.query);

  if (suggestions.hits && suggestions.hits.hits) {
    var hit = suggestions.hits.hits[0]._source;

    this.body = {
      'cui'   : hit.cui,
      'terms' : hit.terms,
      'type'  : suggestions.hits.hits[0]._type
    }
  }
  else {
    this.body = {};
  }
}
