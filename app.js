'use strict';

var version = "19 okt. 2015";

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
}));

app.use(bodyParser);


///////////
// API

router['get']('/', function *() {
  this.body = {
    "version" : version
  };
});



// API
var autocomplete = require('./controllers/autocomplete.js');
var term_lookup = require('./controllers/term_lookup.js');
var expander = require('./controllers/expand.js');
var expandGrouped = require('./controllers/expand_grouped.js'); // Groups result by language
var suggester = require('./controllers/suggest.js');
var concept_children = require('./controllers/children.js');
var concept_related = require('./controllers/related.js');

router['post']('/autocomplete', extractUserId, autocomplete);
router['post']('/term_lookup', term_lookup);
router['post']('/expand', expander);
router['post']('/expand-grouped', extractUserId, expandGrouped);
router['post']('/suggest', suggester);
router['post']('/children', concept_children);
router['post']('/related', concept_related);


// Management for custom terms from users
var concept_management = require("./controllers/concepts/router")(router);
var related_management = require("./controllers/related/router")(router);
var dbc = require("./controllers/dbc/router")(router);


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
    }
    else {
        console.log("Elasticsearch is ON");
    }
});

var neoCheck = request.createClient("http://localhost:7474");
var neoVersion = neoCheck.get("", function(err, res, body) {
    if (err) {
        console.log("Neo4j is OFF");
        console.log(err);
        config.neo4j["is_active"] = false;
    }
    else {
        console.log("Neo4j is ON");
    }
});
