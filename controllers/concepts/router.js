'use strict';

var list    = require('./list');
var byDate  = require('./byDate');
var create  = require('./create');
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
