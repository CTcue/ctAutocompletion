'use strict';


var list    = require('./list');
var byDate  = require('./byDate');

var create  = require('./create');
var read    = require('./read');
var update  = require('./update');
var destroy = require('./destroy');


module.exports = function(app) {
  app['get'] (
    '/umls/list',
    list
  );

  app['get'] (
    '/umls/:year/:month',
    byDate
  );

  app['post'](
    '/umls/create',
    create
  );

  app['get'](
    '/umls/:id',
    read
  );

  app['put'](
    '/umls/:id',
    update
  );

  app['delete'](
    '/umls/:id',
    destroy
  );
***REMOVED***;
