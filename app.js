'use strict';

/** Module dependencies. */
var config = require('./config/config');
var koa    = require('koa');
var app    = koa();

/** KOA Middleware */
var cors   = require('koa-cors');
var router = require('koa-trail');
var json   = require('koa-json');
var helmet = require('koa-helmet');
var parse  = require('./lib/koa-request-body');

var sugar        = require('sugar');
var _            = require('lodash');

var checkBody    = require('./middleware/checkBody.js');
var autocomplete = require('./controllers/autocompleteQuery.js');
var suggest      = require('./controllers/suggestQuery.js');


var filters      = require('./lib/filters.js');

// JSON output
app.use(json({ pretty: true, param: 'pretty' ***REMOVED***));

// Security (XSS)
app.use(helmet.defaults());

// Needed for authentication/authorization
app.use(cors({
  'headers' : [ 'Content-Type', 'Authorization' ]
***REMOVED***));

// Body parser
app.use(parse());

// Routing
app.use(router(app));


/** API */

app.all('/', function *() {
  this.body = {
    success : true
  ***REMOVED***;
***REMOVED***);

/* Example request:

  curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "major dep"
  ***REMOVED***'
*/
app.post('/autocomplete', checkBody, autocomplete);

//app.post('/suggest', checkBody, suggest);

//app.post('/expand', checkBody, expandQuery);


// Listen
app.listen(config.port);
console.log('listening on port %d', config.port);
