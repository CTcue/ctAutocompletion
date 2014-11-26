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

var autocomplete = require('./controllers/autocomplete.js');
var sugar        = require('sugar');
var _            = require('lodash');

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

app.post('/autocomplete', 
  checkBody, 
  simpleQuery, 
  recordSet
);

app.post('/autocomplete/diagnosis', 
  checkBody, 
  diagnosisQuery, 
  recordSet
);

app.post('/autocomplete/medicine', 
  checkBody, 
  medicineQuery, 
  recordSet
);

// Takes an Elasticsearch result and returns the list { CUI : Text ***REMOVED***. 
function * recordSet(next) {
  var set = this.body.suggestions.suggest[0], tmp = [];

  // TODO check additional suggestions
  if (set.options.length == 0) {
    return this.body = [];
  ***REMOVED***

  // Get the payloads
  set = _.pluck(set.options, 'payload');
  
  // For each entry, get the CUI+STR that most matches the query
  for (var i in set) {
    tmp[i] = {
      '_id' : set[i].cui
***REMOVED***;

    var filtered = _.filter(set[i].codes, function(str) {
      return str.startsWith(this);
***REMOVED***, this.body.query);

    if (filtered.length == 1) {
      tmp[i].str = _.sortBy(filtered, 'length')[0];
***REMOVED***
    ***REMOVED***
      filtered = _.filter(set[i].codes, function(str) {
        return str.startsWith(this);
  ***REMOVED***, this.body.query.slice(0, (this.body.query.length+2)*0.5));

      if (filtered.length > 0) {
        tmp[i].str = _.sortBy(filtered, 'length')[0];
  ***REMOVED***
      ***REMOVED***
        tmp[i].str = set[i].codes[0];  
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  // Generate 5 bins
  tmp = _.groupBy(tmp, function(a) {
    var N = a.str.length - this.length;

    if      (N <= 8)  return 0;
    else if (N <= 13) return 1;
    else if (N <= 18) return 2;
    else if (N <= 27) return 3;
    else              return 4;

  ***REMOVED***, this.body.query);


  // For the bins, put terms that start with the query first 
  // and skip entries in the last bin
  tmp = _.reduce(tmp, function(result, v, k) {
    var list = sortByStartsWith(v, this);

    if (typeof result == 'undefined')
      return list;
    else 
      return result.concat(list);

  ***REMOVED***, [], this.body.query);

  this.body = tmp.slice(0,12);
***REMOVED***;

// Put this in LIB functions
function sortByStartsWith(list, term) { 
  if (list.length <= 1)
    return list;

  list = _.groupBy(list, function(obj) {
    return obj.str.startsWith(this);
  ***REMOVED***, term);

  if (!!list['true'] && !!list['false'])
    return list['true'].concat(list['false']);
  else if (!!list['true'])
    return list['true'];
  else
    return list['false'];
***REMOVED***

function * diagnosisQuery(next) {
  this.body.suggestions = yield autocomplete.diagnosis(this.body.query);

  yield next;
***REMOVED***

function * medicineQuery(next) {
  this.body.suggestions = yield autocomplete.medicine(this.body.query);

  yield next;
***REMOVED***

function * simpleQuery(next) {
  this.body.suggestions = yield autocomplete.simple(this.body.query);

  yield next;
***REMOVED***

function * checkBody(next) {
  if (!this.request.body || _.isEmpty(this.request.body) || !!!this.request.body.query) {
    return this.body = {
      'error' : true,
      'msg'   : 'Please provide a valid JSON request body.'
***REMOVED***
  ***REMOVED***

  this.body = {***REMOVED***;
  this.body.query = this.request.body.query;

  yield next;
***REMOVED***;

// Listen
app.listen(config.port);
console.log('listening on port %d', config.port);
