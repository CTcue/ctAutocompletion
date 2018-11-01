
const version = require("./package").version;
const config = require('./config/config');

const koa = require('koa');
const app = module.exports = new koa();
const router = require('koa-router')();
const cors = require('koa-cors');


/////
// Middleware

const bodyParser    = require('./middleware/parse');
const extractUserId = require("./middleware/extractUser");
const verify        = require("./middleware/verify");


app.use(cors({
    "headers" : [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
        "If-Modified-Since",
        "Cache-Control",
        "Pragma",
        "x-user",
        "x-token",
        "umls-u-token",
        "umls-c-token"
    ]
}));

app.use(bodyParser);



/////
// API

const autocompletion = require('./controllers/autocompletion/v2.js');

const term_lookup      = require('./controllers/term_lookup.js');
const expander         = require('./controllers/expand.js');
const expandGrouped    = require('./controllers/expand_grouped.js');
const expandByString   = require('./controllers/expand_by_string.js');
const dbc              = require("./controllers/dbc.js");
const dbc_diagnosis    = require("./controllers/dbc_diagnosis.js");

// Allow management of -custom- added terms from users
const customConcepts = require('./controllers/concepts/list');
const customConceptsbyDate  = require('./controllers/concepts/byDate');

router['get']('/', function *() {
    this.body = {
        "version" : version
    };
});


router['post']('/v2/autocomplete', extractUserId, autocompletion);

router['post']('/term_lookup', term_lookup);
router['post']('/expand-grouped', extractUserId, expandGrouped);
router['post']('/expand-by-string', extractUserId, expandByString);
router['get']('/dbc/:code', dbc_diagnosis);

router['get'] ('/umls/list', verify, customConcepts);
router['get'] ('/umls/:year/:month', verify, customConceptsbyDate);


const port = process.env.PORT || config.port;

app.use(router.routes());
app.listen(port);

console.info('listening on port %d', port);
