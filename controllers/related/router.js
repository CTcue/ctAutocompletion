'use strict';

var list    = require('./list');
var extract = require('./extract');
var create  = require('./create');
var destroy = require('./destroy');

// Check for admin token
var verify = require("../verify");


module.exports = function(app) {
  app['get'] (
    '/related/list',
***REMOVED*** verify,
    list
  );

  app['post'] (
    '/related/extract',
    verify,
    extract
  );

  app['post'](
    '/related/create',
    verify,
    create
  );

  app['delete'](
    '/related/group/:name',
    verify,
    destroy
  );
***REMOVED***;
