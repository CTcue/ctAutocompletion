'use strict';

var verify = require("./verify");

var list    = require('./list');
var extract = require('./extract');

var create  = require('./create');
var read    = require('./read');
var update  = require('./update');
var destroy = require('./destroy');


module.exports = function(app) {
  app['get'] (
    '/related/list',
    list
  );

  app['post'] (
    '/related/extract',
    extract
  );

  // app['post'](
  //   '/umls/create',
  //   create
  // );

  // app['get'](
  //   '/umls/:id',
  //   read
  // );

  // app['put'](
  //   '/umls/:id',
  //   update
  // );

  app['delete'](
    '/related/group/:name',
    destroy
  );
***REMOVED***;
