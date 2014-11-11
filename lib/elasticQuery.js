'use strict';

/** Module dependencies. */
var config    = require('../config/config.js');
var reqClient = require('request-json').newClient(config.elastic);

function elasticQuery(terms) {
  return function(callback) {
      callback('foo');
  ***REMOVED***;
***REMOVED***;

module.exports = elasticQuery;