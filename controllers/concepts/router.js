'use strict';

var list    = require('./list');
var byDate  = require('./byDate');
var create  = require('./create');
var duplicates = require('./duplicates');
var recommend = require('./recommend');

var verify = require("./verify");


module.exports = function(app) {
  app['get'] (
    '/umls/list',
    verify,
    list
  );

  app['get'] (
    '/umls/:year/:month',
    verify,
    byDate
  );

  app['get'] (
    '/umls/duplicates',
    verify,
    duplicates
  );

  app['post'](
    '/umls/create',
    verify,
    create
  );

  app['post'](
    '/umls/recommend',
    recommend
  );
};
