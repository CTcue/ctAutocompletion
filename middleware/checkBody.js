
var _ = require('lodash');

module.exports = function *(next) {
  if (isInvalidObjQuery(this.request)) {
    return this.body = {
      'error' : true,
      'msg'   : 'Please provide a valid JSON request, with a `{ "query" : "value" }`.'
    }
  }

  // Queries should not be empty or single character
  if (this.request.body.query.length <= 1) {
    return this.body = [];
  }

  this.body = {};
  this.body.query = this.request.body.query.trim().toLowerCase();

  yield next;
};

function isInvalidObjQuery(obj) {
  return !obj.body       ||
    _.isEmpty(obj.body)  ||
    !!!obj.body.query    ||
    typeof obj.body.query !== 'string';
}
