
const version = require("./package").version;
const config = require("./config/config");

const koa = require("koa");
const app = module.exports = new koa();
const router = require("koa-router")();
const cors = require("koa-cors");


// Logging (simple)
const winston = require("winston");

winston.add(winston.transports.File, {
    filename: `${__dirname}/logs/user_selected.log`,
    level: "info",
    timestamp: true,
    handleExceptions: true
});

// Only log it in log file
winston.remove(winston.transports.Console);


const logUserSelection = function *() {
    // - user_id=>environment (keeps it reasonably anonymous)
    const headers = this.req.headers;

    // User selected CUI (by clicking)
    const query   = this.request.body.query || "";

    // String used to create autocompletion suggestion list
    const user_typed = this.request.body.user_typed || "";

    // Pref. term of the clicked suggestion
    const pref = this.pref_term || "";

    winston.info(`${headers["x-user"]} | ${user_typed} | ${query} | ${pref}`);
};


// Middleware
const bodyParser    = require("./middleware/parse");
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
        "x-token"
    ]
}));

app.use(bodyParser);

// --------------
// API

const autocomplete_es5 = require("./controllers/autocompletion/v3.js");
const expandGrouped    = require("./controllers/expand_grouped.js");
const expandByString   = require("./controllers/expand_by_string.js");

const dbc              = require("./controllers/dbc.js");
const dbc_diagnosis    = require("./controllers/dbc_diagnosis.js");

// Management of custom added terms (from users)
const recommend = require("./controllers/recommend.js");
const customConcepts = require("./controllers/concepts/list");
const customConceptsByDate  = require("./controllers/concepts/byDate");


router["get"]("/", function* () {
    this.body = {
        "version" : version
    };
});

router["post"]("/v3/autocomplete", extractUserId, autocomplete_es5);
router["post"]("/expand-grouped", extractUserId, expandGrouped, logUserSelection);
router["post"]("/expand-by-string", extractUserId, expandByString, logUserSelection);

router["get"]("/dbc/:code", dbc_diagnosis);
router["post"]("/dbc", dbc);

router["post"]("/recommend", recommend);
router["get"]("/umls/list", verify, customConcepts);
router["get"]("/umls/:year/:month", verify, customConceptsByDate);



const port = process.env.PORT || config.port;

app.use(router.routes());
app.listen(port);

console.info("listening on port %d", port);
