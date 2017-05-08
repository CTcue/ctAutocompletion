'use strict';

var version = require("./package").version;
var config = require('./config/config');

var koa = require('koa');
var app = module.exports = new koa();
var router = require('koa-router')();
var request = require('request-json');
var cors = require('koa-cors');


/////
// Logging (simple)
var winston = require('winston');

winston.add(winston.transports.File, {
    filename: `${__dirname***REMOVED***/logs/user_selected.log`,
    level: 'info',
    timestamp: true,
    handleExceptions: true
***REMOVED***);

// Only log it in log file
winston.remove(winston.transports.Console);


var logUserSelection = function *() {
***REMOVED*** - user_id=>environment (keeps it reasonably anonymous)
    var headers = this.req.headers;

***REMOVED*** User selected CUI (by clicking)
    var query   = this.request.body.query || "";

***REMOVED*** String used to create autocompletion suggestion list
    var user_typed = this.request.body.user_typed || "";

***REMOVED*** Pref. term of the clicked suggestion
    var pref = this.pref_term || "";

    winston.info(`${headers["x-user"]***REMOVED*** | ${user_typed***REMOVED*** | ${query***REMOVED*** | ${pref***REMOVED***`);
***REMOVED***



/////
// Middleware

var bodyParser    = require('./middleware/parse');
var extractUserId = require("./middleware/extractUser");
var verify        = require("./middleware/verify");


app.use(cors({
    "headers" : [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
        "If-Modified-Since",
        "Cache-Control",
        "x-user",
        "x-token",
        "umls-u-token",
        "umls-c-token"
    ]
***REMOVED***));

app.use(bodyParser);



/////
// API

// try {
***REMOVED*** Autocompletion (versions to test with master / dev / canary etc.)
    var autocomplete_master = require('./controllers/autocompletion/v1.js');
    var autocomplete_dev    = require('./controllers/autocompletion/v2.js');

***REMOVED*** All other API's (don't really need versioning yet)
    var term_lookup      = require('./controllers/term_lookup.js');
    var expander         = require('./controllers/expand.js');
    var expandGrouped    = require('./controllers/expand_grouped.js');
    var expandByString   = require('./controllers/expand_by_string.js');
    var suggester        = require('./controllers/suggest.js');
    var concept_children = require('./controllers/children.js');
    var concept_related  = require('./controllers/related.js');
    var dbc              = require("./controllers/dbc.js");
    var dbc_diagnosis    = require("./controllers/dbc_diagnosis.js");


***REMOVED*** Allow users to add/recommend custom terms
    var recommend = require('./controllers/recommend.js');


***REMOVED*** Allow management of -custom- added terms from users
    var customConcepts = require('./controllers/concepts/list');
    var customConceptsbyDate  = require('./controllers/concepts/byDate');
// ***REMOVED***
// catch (err) {
//     console.error(err);
// ***REMOVED***



router['get']('/', function *() {
    this.body = {
        "version" : version
***REMOVED***;
***REMOVED***);


router['post']('/v1/autocomplete', extractUserId, autocomplete_master);
router['post']('/v2/autocomplete', extractUserId, autocomplete_dev);

router['post']('/term_lookup', term_lookup);
router['post']('/expand', expander);
router['post']('/expand-grouped', extractUserId, expandGrouped, logUserSelection);
router['post']('/expand-by-string', extractUserId, expandByString, logUserSelection);
router['post']('/suggest', suggester);
router['post']('/children', concept_children);
router['post']('/related', concept_related);
router['get']('/dbc/:code', dbc_diagnosis);
router['post']('/dbc', dbc);
router['post']('/recommend', recommend);
router['get'] ('/umls/list', verify, customConcepts);
router['get'] ('/umls/:year/:month', verify, customConceptsbyDate);


// Listen
var port = process.env.PORT || config.port;
app.use(router.routes());
app.listen(port);
console.info('listening on port %d', port);



// //
// // Check if Elasticsearch and Neo4j are available
// //

// var elasticCheck = request.createClient("http://localhost:9200");
// var elasticVersion = elasticCheck.get("", function(err, res, body) {
//     if (err) {
//         console.info("Elasticsearch is OFF");
//         console.info(err);
// ***REMOVED***
//     ***REMOVED***
//         console.info("Elasticsearch is ON");
// ***REMOVED***
// ***REMOVED***);

// var neoCheck = request.createClient("http://localhost:7474");
// var neoVersion = neoCheck.get("", function(err, res, body) {
//     if (err) {
//         console.info("Neo4j is OFF");
//         console.info(err);
//         config.neo4j["is_active"] = false;
// ***REMOVED***
//     ***REMOVED***
//         console.info("Neo4j is ON");
//         ***REMOVED***
// ***REMOVED***
// ***REMOVED***);
