'use strict';

var version = "29 may 2015";

/** Module dependencies. */
var config = require('./config/config');

var koa    = require('koa');
var app = module.exports = koa();

/** KOA Middleware */
var cors   = require('koa-cors');
var router = require('koa-trail');
var json   = require('koa-json');
var helmet = require('koa-helmet');
var parse  = require('./lib/koa-request-body');

var checkBody   = require('./middleware/checkBody.js');
var checkSecret = require('./middleware/checkSecret.js');

var autocomplete = require('./controllers/autocompleteQuery.js');
var expander     = require('./controllers/expandQuery.js');
var customTerms  = require('./controllers/customTerms.js');
var addedTerms   = require('./controllers/addedTerms.js');
var removeTerm   = require('./controllers/removeTerm.js');

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
    "version" : version,
    "success" : true
  ***REMOVED***;
***REMOVED***);

/* Example request: POST since we will need more parameters for context (domain, type)

  curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "major dep"
  ***REMOVED***'
*/
app.post('/autocomplete', checkBody, autocomplete);
app.post('/expand',       checkBody, expander);


/* Example request to add terms to cUMLS autocomplete:

  Headers: x-auth-token : "secret code"
  curl -XPOST 178.62.230.23/custom -d '{
    "user" : { name, email, environment etc ***REMOVED***,

    "term"     : "Agatston score",

***REMOVED*** (optional)
    "synonyms" : [
      "Calcium score",
      "Agatston-score",
      ...
    ]
  ***REMOVED***'
*/
app.post('/custom', customTerms);
app.get('/addedTerms', checkSecret, addedTerms);
app.post('/removeTerm', checkSecret, removeTerm);

// Listen
app.listen(config.port);
console.log('listening on port %d', config.port);
