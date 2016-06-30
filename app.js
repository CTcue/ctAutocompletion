'use strict';

var version = require("./package").version;

var config = require('./config/config');
var koa = require('koa');
var app = module.exports = koa();
var router = require('koa-router')();
var bodyParser = require('./middleware/parse');
var extractUserId = require("./middleware/extractUser");
var request = require('request-json');
var cors = require('koa-cors');

app.use(cors({
    "headers" : [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
        "If-Modified-Since",
        "Cache-Control",
        "umls-u-token",
        "umls-c-token",
        "x-user"
    ]
***REMOVED***));

app.use(bodyParser);


///////////
// API

router['get']('/', function *() {
  this.body = {
    "version" : version
  ***REMOVED***;
***REMOVED***);



// API

var term_lookup = require('./controllers/term_lookup.js');
var expander = require('./controllers/expand.js');
var expandGrouped = require('./controllers/expand_grouped.js'); // Groups result by language
var suggester = require('./controllers/suggest.js');
var concept_children = require('./controllers/children.js');
var concept_related = require('./controllers/related.js');

var dbc = require("./controllers/dbc.js");
var dbc_diagnosis = require("./controllers/dbc_diagnosis.js");


// Temp workaround to allow multiple instances
var autocomplete_v0 = require('./controllers/v0/autocomplete.js');
var autocomplete_v1 = require('./controllers/v1/autocomplete.js');

router['post']('/autocomplete', extractUserId, autocomplete_v0);
router['post']('/v1/autocomplete', extractUserId, autocomplete_v1);


router['post']('/term_lookup', term_lookup);
router['post']('/expand', expander);
router['post']('/expand-grouped', extractUserId, expandGrouped);
router['post']('/suggest', suggester);
router['post']('/children', concept_children);
router['post']('/related', concept_related);

router['get']('/dbc/:code', dbc_diagnosis);
router['post']('/dbc', dbc);




// Listen
app.use(router.routes());
app.listen(config.port);
console.log('listening on port %d', config.port);



//
// Check if Elasticsearch and Neo4j are available
//

var elasticCheck = request.createClient("http://localhost:9200");
var elasticVersion = elasticCheck.get("", function(err, res, body) {
    if (err) {
        console.log("Elasticsearch is OFF");
        console.log(err);
***REMOVED***
    ***REMOVED***
        console.log("Elasticsearch is ON");
***REMOVED***
***REMOVED***);

var neoCheck = request.createClient("http://localhost:7474");
var neoVersion = neoCheck.get("", function(err, res, body) {
    if (err) {
        console.log("Neo4j is OFF");
        console.log(err);
        config.neo4j["is_active"] = false;
***REMOVED***
    ***REMOVED***
        console.log("Neo4j is ON");
***REMOVED***
***REMOVED***);
