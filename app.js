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

var autocomplete = require('./controllers/autocomplete.js');
var filters      = require('./lib/filters.js');

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

app.post('/autocomplete', 
  checkBody, 
  simpleQuery
);

app.post('/autocomplete/diagnosis', 
  checkBody, 
  diagnosisQuery 
);

app.post('/autocomplete/medicine', 
  checkBody, 
  medicineQuery
);



function * diagnosisQuery(next) {
  var suggestions = yield autocomplete.diagnosis(this.body.query);
  var set = suggestions.suggest[0];

  // TODO check additional suggestions
  if (set.options.length == 0) {
    return this.body = [];
  }

  // Get the payloads
  set = _.pluck(set.options, 'payload');

  // Get recommendations
  set = filters.suggestionsFromElasticRecords(set, this.body.query);

  this.body = set.slice(0,12); 
}

function * medicineQuery(next) {
  var suggestions = yield autocomplete.medicine(this.body.query);
  var set = suggestions.suggest[0];

  // TODO check additional suggestions
  if (set.options.length == 0) {
    return this.body = [];
  }

  // Get the payloads
  set = _.pluck(set.options, 'payload');

  // Get recommendations
  set = filters.suggestionsFromElasticRecords(set, this.body.query);

  this.body = set.slice(0,12); 
}

function * simpleQuery(next) {
  var suggestions = yield autocomplete.simple(this.body.query);
  var set = suggestions.suggest[0];

  // TODO check additional suggestions
  if (set.options.length == 0) {
    return this.body = [];
  }

  // Get the payloads
  set = _.pluck(set.options, 'payload');

  // Get recommendations
  set = filters.suggestionsFromElasticRecords(set, this.body.query);

  this.body = set.slice(0,12); 
}

function * checkBody(next) {
  if (!this.request.body || _.isEmpty(this.request.body) || !!!this.request.body.query) {
    return this.body = {
      'error' : true,
      'msg'   : 'Please provide a valid JSON request body.'
    }
  }

  // Queries should not be empty or single character
  if (this.request.body.query.length <= 1) {
    return this.body = [];
  }
  

  this.body = {};
  this.body.query = this.request.body.query;

  yield next;
};

// Listen
app.listen(config.port);
console.log('listening on port %d', config.port);
