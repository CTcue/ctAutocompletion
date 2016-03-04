'use strict';

var version = "19 okt. 2015";

var config = require('./config/config');
var koa = require('koa');
var app = module.exports = koa();
var router = require('koa-router')();

var cors = require('koa-cors');
app.use(cors({
    "headers" : [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
        "If-Modified-Since",
        "Cache-Control"
    ]
***REMOVED***));

var bodyParser = require('./middleware/parse');
app.use(bodyParser);


///////////
// API

router['get']('/', function *() {
  this.body = {
    "version" : version
  ***REMOVED***;
***REMOVED***);

/*
  curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "major dep"
  ***REMOVED***'
*/
var autocomplete = require('./controllers/autocomplete.js');
router['post']('/autocomplete', autocomplete);

var term_lookup = require('./controllers/term_lookup.js');
router['post']('/term_lookup', term_lookup);

/*
  curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "C1269683"
  ***REMOVED***'
*/
var expander = require('./controllers/expand.js');
router['post']('/expand', expander);

// Similar to expander, but groups + sorts result by language
var expandGrouped = require('./controllers/expand_grouped.js');
router['post']('/expand-grouped', expandGrouped);

var suggester = require('./controllers/suggest.js');
router['post']('/suggest', suggester);


var recommender = require('./controllers/recommend.js');
router['post']('/recommend/add', recommender.add);


app.use(router.routes());
app.listen(config.port);
console.log('listening on port %d', config.port);
