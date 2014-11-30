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

// Simple autocompletion
app.post('/autocomplete', 
  checkBody,
  medQuery 
);

// Allows type -> diagnosis / medicine
app.post('/autocomplete/:type', 
  checkBody,
  medQuery 
);


function * checkBody(next) {
  if (!this.request.body || _.isEmpty(this.request.body) || !!!this.request.body.query) {
    return this.body = {
      'error' : true,
      'msg'   : 'Please provide a valid JSON request body.'
***REMOVED***
  ***REMOVED***

  // Queries should not be empty or single character
  if (this.request.body.query.length <= 1) {
    return this.body = [];
  ***REMOVED***
  
  this.body = {***REMOVED***;
  this.body.query = this.request.body.query.trim().toLowerCase();

  yield next;
***REMOVED***;


function * medQuery(next) {
  var suggestions = yield autocomplete.fn(this.body.query, this.params.type);
  var set = suggestions.suggest[0];

  // If we have suggestions for given query
  if (set.options.length > 0) {
***REMOVED*** Get the payloads + best recommendations
    set = _.pluck(set.options, 'payload');
    set = filters.suggestionsFromElasticRecords(set, this.body.query);

    return this.body = set.slice(0, 12); 
  ***REMOVED***
  ***REMOVED***
***REMOVED*** No suggestions yet
    var words = this.body.query.words();

***REMOVED*** Does the query contain multiple words?
    if (words.length > 0) {
      var payloads = {***REMOVED***;
      var cuiCodes = [];

  ***REMOVED*** For the additional words
      for (var i=0, L=words.length; i<L; i++) {
        var suggestions = yield autocomplete.fn(words[i], this.params.type, querySize(words[i]), "words");
        var set = suggestions.suggest[0];
            set = _.pluck(set.options, 'payload');

        payloads = _.assign(set);
        cuiCodes.push( _.pluck(set, 'cui'));
  ***REMOVED***

      if (words.length == 2) {
        var intersection = _.intersection(cuiCodes[0], cuiCodes[1]);
  ***REMOVED***
      else if (words.length == 3) {
        var intersection = _.intersection(cuiCodes[0], cuiCodes[1], cuiCodes[2]);
  ***REMOVED***
      ***REMOVED***
        var intersection = _.intersection(cuiCodes[0], cuiCodes[1], cuiCodes[2], cuiCodes[3]);
  ***REMOVED***

  ***REMOVED*** TODO If intersection is empty, skip word and check for other combinations?

      var set = _.filter(payloads, function(a) {
        return this.indexOf(a.cui) >= 0;
  ***REMOVED***, intersection);

  ***REMOVED*** Get recommendations
      set = filters.suggestionsFromElasticRecords(set, words[0]);

      return this.body = set.slice(0, 12);
***REMOVED***
  ***REMOVED***

  // TODO look for larger set?

  this.body = [];
***REMOVED***

function querySize(str) {
  var N = str.length;

  if (N <= 5) {
    return 150;
  ***REMOVED***
  else if (N < 10) {
    return 100;
  ***REMOVED***
  ***REMOVED***
    return 80;
  ***REMOVED***
***REMOVED***


// Listen
app.listen(config.port);
console.log('listening on port %d', config.port);
