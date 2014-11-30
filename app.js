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


function * medQuery(next) {
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
      var payloads = {};
      var cuiCodes = [];

      // For the additional words
      for (var i=0, L=words.length; i<L; i++) {
        var suggestions = yield autocomplete.fn(words[i], this.params.type, querySize(words[i]), "words");
        var set = suggestions.suggest[0];
            set = _.pluck(set.options, 'payload');

        payloads = _.assign(set);
        cuiCodes.push( _.pluck(set, 'cui'));
      }

      if (words.length == 2) {
        var intersection = _.intersection(cuiCodes[0], cuiCodes[1]);
      }
      else if (words.length == 3) {
        var intersection = _.intersection(cuiCodes[0], cuiCodes[1], cuiCodes[2]);
      }
      else {
        var intersection = _.intersection(cuiCodes[0], cuiCodes[1], cuiCodes[2], cuiCodes[3]);
      }

      // TODO If intersection is empty, skip word and check for other combinations?

      var set = _.filter(payloads, function(a) {
        return this.indexOf(a.cui) >= 0;
      }, intersection);

      // Get recommendations
      set = filters.suggestionsFromElasticRecords(set, words[0]);

      return this.body = set.slice(0, 12);
    }
  }

  // TODO look for larger set?

  this.body = [];
}

function querySize(str) {
  var N = str.length;

  if (N <= 5) {
    return 150;
  }
  else if (N < 10) {
    return 100;
  }
  else {
    return 80;
  }
}


// Listen
app.listen(config.port);
console.log('listening on port %d', config.port);
