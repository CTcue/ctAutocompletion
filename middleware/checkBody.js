
var _ = require('lodash');

module.exports = function *(next) {
  if (isInvalidObjQuery(this.request)) {
    return this.body = {
      'error' : true,
      'msg'   : 'Please provide a valid JSON request, with a `{ "query" : "value" }`.'
    }
  }

  // Queries should not be empty or single character
  // Elasticsearch is slow with single character query, as it returns so many results
  if (this.request.body.query.length < 2) {
    return this.body = {
      "took" : 10,
      "hits" : [],
      "msg"  : "Cannot autocomplete for single character"
    };
  }

  this.body = {};
  this.body.query = this.request.body.query.trim();

  yield next;
};

function isInvalidObjQuery(obj) {
  return !obj.body       ||
    _.isEmpty(obj.body)  ||
    !!!obj.body.query    ||
    typeof obj.body.query !== 'string';
}
