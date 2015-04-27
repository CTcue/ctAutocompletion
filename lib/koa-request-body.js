'use strict';

var parse = require('co-body');

module.exports = function() {
  return function *(next) {
    if (this.request.body !== undefined) {
        return yield* next;
***REMOVED***

    if (this.request.is('application/json', 'application/vnd.api+json', 'application/csp-report')) {
        this.request.body = yield parse.json(this);
***REMOVED***
    else if (this.request.is('application/x-www-form-urlencoded')) {
        this.request.body = yield parse.form(this);
***REMOVED***
    ***REMOVED***
  ***REMOVED***
        this.request.body = yield parse.json(this);
  ***REMOVED***
  ***REMOVED***
        this.request.body = null;
  ***REMOVED***
***REMOVED***

    yield* next;
  ***REMOVED***;
***REMOVED***;
