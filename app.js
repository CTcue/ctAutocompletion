'use strict';

var version = "1.0.1";

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
    "version" : version,
    "success" : true
  };
});

/* Example request: POST since we will need more parameters for context (domain, type)

  curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "major dep"
  }'
*/
app.post('/autocomplete', checkBody, autocomplete);
app.post('/expand',       checkBody, expander);


/* Example request to add terms to cUMLS autocomplete:

  Headers: x-auth-token : "secret code"
  curl -XPOST 178.62.230.23/custom -d '{
    "user" : { name, email, environment etc },

    "term"     : "Agatston score",

    // (optional)
    "synonyms" : [
      "Calcium score",
      "Agatston-score",
      ...
    ]
  }'
*/
app.post('/custom', checkSecret, customTerms);

/*
app.get('/custom',  function *() {
  var config = require('./config/config.js');

  // Database
  var db   = require('monk')(config.mongodb.path);
  var wrap = require('co-monk');
  var table = wrap(db.get('customTerms'));

  this.body = yield table.find({});
});
*/

app.post('/deploy', function *() {
  console.log('Deploying CTcUMLS');

  var crypto  = require("crypto");
  var exec    = require("child_process").exec, child;
  var secrets = require('./ctcue-config/deploy_secrets');

  var hmac = crypto.createHmac('sha1', secrets.ctcumls);
      hmac.update(JSON.stringify(this.request.body));

  var calculatedSignature = 'sha1=' + hmac.digest('hex');

  if (this.req.headers['x-hub-signature'] === calculatedSignature) {
    if (this.request.body.ref === "refs/heads/master") {
      exec("git pull && git submodule update && npm install && forever restartall");
    }
    else {
      // Currently we do nothing with branches
    }
  }
  else {
    console.log('Invalid signature.');
  }

  this.body = { "success" : true };
});


// Listen
app.listen(config.port);
console.log('listening on port %d', config.port);
