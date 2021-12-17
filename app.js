
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
const expandGrouped    = require('./controllers/expand_grouped.js');
const expandByString   = require('./controllers/expand_by_string.js');

router['get']('/', function *() {
    this.body = {
        "version" : version
    };
});

router['post']('/v2/autocomplete', extractUserId, autocompletion);
router['post']('/term_lookup', term_lookup);
router['post']('/expand-grouped', extractUserId, expandGrouped);
router['post']('/expand-by-string', extractUserId, expandByString);

const port = process.env.PORT || config.port;

app.use(router.routes());
app.listen(port);

console.info('listening on port %d', port);
