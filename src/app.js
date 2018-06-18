
const version = require("../package.json").version;
const config = require("../config/config");
const PORT = process.env.PORT || config.port;


const autocomplete = require("./controllers/autocomplete.js");
// const expandGrouped    = require("./controllers/expand_grouped.js");
// const expandByString   = require("./controllers/expand_by_string.js");

// const dbc              = require("./controllers/dbc.js");
// const dbc_diagnosis    = require("./controllers/dbc_diagnosis.js");

// // Management of custom added terms (from users)
// const recommend = require("./controllers/recommend.js");
// const customConcepts = require("./controllers/concepts/list");
// const customConceptsByDate  = require("./controllers/concepts/byDate");


// router["post"]("/v3/autocomplete", extractUserId, autocomplete_es5);
// router["post"]("/expand-grouped", extractUserId, expandGrouped, logUserSelection);
// router["post"]("/expand-by-string", extractUserId, expandByString, logUserSelection);

// router["get"]("/dbc/:code", dbc_diagnosis);
// router["post"]("/dbc", dbc);

// router["post"]("/recommend", recommend);
// router["get"]("/umls/list", verify, customConcepts);
// router["get"]("/umls/:year/:month", verify, customConceptsByDate);


const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const Koa = require('koa');
const app = module.exports = new Koa();


async function health(ctx) {
    ctx.body = { "version": version };
};


app.use(cors());
app.use(logger());
app.use(koaBody({ jsonLimit: "4kb" }));


router.get("/", health);
router.post("/autocomplete", autocomplete);


app.use(router.routes());


if (!module.parent) {
    console.info(`* [ctAutocompletion] port ${PORT}`);
    app.listen(PORT);
}
