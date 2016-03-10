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
        "Cache-Control",
        "umls-u-token",
        "umls-c-token",
        "x-user"
    ]
}));

var bodyParser = require('./middleware/parse');
app.use(bodyParser);


///////////
// API

router['get']('/', function *() {
  this.body = {
    "version" : version
  };
});

/*
  curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "major dep"
  }'
*/
var autocomplete = require('./controllers/autocomplete.js');
router['post']('/autocomplete', autocomplete);


var term_lookup = require('./controllers/term_lookup.js');
router['post']('/term_lookup', term_lookup);


/*
  curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "C1269683"
  }'
*/
var expander = require('./controllers/expand.js');
router['post']('/expand', expander);

// Similar to expander, but groups + sorts result by language
var expandGrouped = require('./controllers/expand_grouped.js');
router['post']('/expand-grouped', expandGrouped);

var suggester = require('./controllers/suggest.js');
router['post']('/suggest', suggester);


var concept_management = require("./controllers/concepts/router")(router);
var related_management = require("./controllers/related/router")(router);


app.use(router.routes());
app.listen(config.port);
console.log('listening on port %d', config.port);



/////////
// Check if Elasticsearch and Neo4j are available
var request = require('request-json');

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
    }
    else {
        console.log("Neo4j is ON");
    }
});
