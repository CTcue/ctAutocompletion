'use strict';

/** Module dependencies. */
var config        = require('./config/config');
var koa           = require('koa');
var app           = module.exports = koa();
var _             = require('lodash');

/** KOA Middleware */
var cors          = require('koa-cors');
var router        = require('koa-trail');
var parse         = require('koa-parse-json');
var json          = require('koa-json');
var helmet        = require('koa-helmet');

var autocomplete  = require('./controllers/autocompleteController.js');
var elasticQuery  = require('./lib/elasticQuery.js');

// JSON output
app.use(json({ pretty: true, param: 'pretty' }));

// Security (XSS)
app.use(helmet.defaults());

// Needed for authentication/authorization
app.use(cors({
  'headers' : [ 'Content-Type', 'Authorization' ]
}));

// Body parser
app.use(parse());

// Routing
app.use(router(app));

/** API */
app.all('/', function *() {
  this.body = {
    success : true
  };
});

app.post('/autocomplete', function *() {
  var searchQuery = this.request.body.query;

  var results = yield autocomplete(searchQuery);

  this.body = results;

});

// Listen
app.listen(config.port);
console.log('listening on port %d', config.port);