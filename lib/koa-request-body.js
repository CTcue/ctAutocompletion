'use strict';

var parse = require('co-body');

module.exports = function() {
  return function *(next) {
    if (this.request.body !== undefined) {
      return yield* next;
    }
      
    if (this.request.is('application/json', 'application/vnd.api+json', 'application/csp-report')) {
      this.request.body = yield parse.json(this);
    } 
    else if (this.request.is('application/x-www-form-urlencoded')) {
      this.request.body = yield parse.form(this);
    } 
    else if (this.request.is('multipart/form-data')) {
      this.request.body = null;
    } 
    else {
      try {
        this.request.body = yield parse.json(this);
      }
      catch (err) {
        this.request.body = null;
      }
    }

    yield* next;
  };
};
