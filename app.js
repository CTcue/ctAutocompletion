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
var suggest      = require('./controllers/suggest.js');

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

app.post('/suggest/:type', 
  checkBody,
  suggestQuery 
);

app.post('/expand', 
  checkBody,
  expandQuery 
);

function * suggestQuery() {
  var query = this.body.query.words(); 
  var suggestions = [], tmp = {};

  /*
    Some suggestions can be quite random, so get autocomplete suggestions
    as well.
  */
  if (query.length > 1) {
    tmp = yield autocomplete.words(query, this.params.type, 5);
  }
  else {
    tmp = yield autocomplete.startsWith(query, this.params.type, 5);
  }

  if (tmp.hits && tmp.hits.total > 0) {
    suggestions = tmp.hits.hits;
  }


  // Look for suggestions in the terms
  var alt = yield suggest.match(query, this.params.type);

  if (alt.hits && alt.hits.total > 0) {
    // Get found CUI codes in suggestions
    var added = suggestions.map(function(a) { return a._source.cui });

    // Reject already found CUI codes
    var hits = _.reject(alt.hits.hits, function(a) {
      return this.indexOf(a._source.cui) >= 0;  
    }, added);

    suggestions = suggestions.concat(hits);
  }

  // Convert Elastic results to our JSON objects
  if (suggestions.length > 0) {
    var set = [];

    for (var i=0, L=suggestions.length; i<L; i++) {
      var terms = suggestions[i]._source.terms;

      // Only include reason suggestsions that have the query word in it
      var reason = _.filter(terms, function(str) {
        return str.has(this);
      }, query[0]);

      // Long terms / many words get a score penalty
      var lengthPenalty = terms[0].words().length - 2;
      var score = suggestions[i]._score - lengthPenalty;

      if (score < 2.5)
        continue;

      set.push({
        "_id"    : suggestions[i]._source.cui,
        "str"    : terms[0],
        "score"  : score,
        "reason" : reason
      });
    }

    // Sort the list by score
    set = _.sortBy(set, function(a){ 
      return -a.score 
    }).slice(0, 12);

    return this.body = set; 
  }

  this.body = [];
}

function * medQuery() {
  var suggestions = yield autocomplete.fn(this.body.query, this.params.type);
  var set = suggestions.suggest[0];

  // If we have suggestions for given query
  if (set.options.length > 0) {
    // Get the payloads + best recommendations
    set = _.pluck(set.options, 'payload');
    set = filters.suggestionsFromElasticRecords(set, this.body.query);

    return this.body = set.slice(0, 12); 
  }
  else {
    // No suggestions yet
    var words = this.body.query.words();

    // Does the query contain multiple words?
    if (words.length > 0) {
      suggestions = yield autocomplete.startsWith(words, this.params.type);

      if (suggestions.hits && suggestions.hits.total > 0) {
        var tmp = suggestions.hits.hits;
        set = [];

        for (var i=0, L=tmp.length; i<L; i++) {
          if (tmp[i]._score < 2) 
            continue;
          
          set.push({
            "_id"   : tmp[i]._source.cui,
            "str"   : tmp[i]._source.terms[0]
          });
        }

        return this.body = set.slice(0, 12); 
      }
    }
  }

  // If nothing is found, client can send the query to "/suggest" 

  this.body = [];
}

function * expandQuery() {
  var suggestions = yield autocomplete.expandCUI(this.body.query, this.params.type);
  
  if (suggestions.hits && suggestions.hits.hits) {
    var hit = suggestions.hits.hits[0]._source;

    this.body = {
      'cui'   : hit.cui,
      'terms' : hit.terms,
      'type'  : suggestions.hits.hits[0]._type
    }
  }
  else {
    this.body = {};
  }
}

function * checkBody(next) {
  if (isInvalidObjQuery(this.request)) {
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
  this.body.query = this.request.body.query.trim().toLowerCase();

  yield next;
};

function isInvalidObjQuery(obj) {
  return !obj.body       || 
    _.isEmpty(obj.body)  ||
    !!!obj.body.query    || 
    typeof obj.body.query !== 'string';
}

// Listen
app.listen(config.port);
console.log('listening on port %d', config.port);
