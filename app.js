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


var extractUserId = function *(next) {
    this.user = false;

    if (this.headers.hasOwnProperty("x-user")) {
        // Format `user_id=>environment`
        var user_header = this.headers["x-user"].split("=>");

        try {
            this.user = {
                "_id": user_header[0].trim(),
                "env": user_header[1].toLowerCase().trim()
            };
        }
        catch (err) {
            // Wrong header format
            this.user = false;
        }
    }


    yield next;
}


/*
  curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "major dep"
  }'
*/
var autocomplete = require('./controllers/autocomplete.js');
router['post']('/autocomplete', extractUserId, autocomplete);


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
router['post']('/expand-grouped', extractUserId, expandGrouped);

var suggester = require('./controllers/suggest.js');
router['post']('/suggest', suggester);


// Management for custom terms from users
var concept_management = require("./controllers/concepts/router")(router);
var related_management = require("./controllers/related/router")(router);


// DBC endpoint(s)
var dbc = require("./controllers/dbc/router")(router);


// Listen
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

        config.neo4j["is_active"] = false;
    }
    else {
        console.log("Neo4j is ON");
    }
});
