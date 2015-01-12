
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
