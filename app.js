
const version = require("./package").version;
const config = require('./config/config');

const koa = require('koa');
const app = module.exports = new koa();
const router = require('koa-router')();
const cors = require("@koa/cors");

/////
// Middleware

const bodyParser    = require('./middleware/parse');
const extractUserId = require("./middleware/extractUser");

app.use(cors());
app.use(bodyParser);

/////
// API

router['get']('/', function *() {
    this.body = {
        "version" : version
    };
});

const autocompletion = require('./controllers/autocomplete.js');
router['post']('/v2/autocomplete', extractUserId, autocompletion);

const expand = require('./controllers/expand.js');
router['post']('/expand', extractUserId, expand);

/////
// V2 end-points (deprecated)

const expandGrouped    = require('./controllers/expand_grouped.js');
router['post']('/expand-grouped', extractUserId, expandGrouped);

const expandByString   = require('./controllers/expand_by_string.js');
router['post']('/expand-by-string', extractUserId, expandByString);

const port = process.env.PORT || config.port;

app.use(router.routes());
app.listen(port);

console.info('listening on port %d', port);
