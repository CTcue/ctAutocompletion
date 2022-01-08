const version = require("./package").version;
const config = require("./config/config");

const router = require("koa-router")();
const koaBody = require("koa-body");
const cors = require("@koa/cors");

const koa = require("koa");
const app = module.exports = new koa();

app.use(cors());
app.use(koaBody({ jsonLimit: "4kb" }));

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        console.error(err);

        ctx.status = err.status || 500;
        ctx.body = {
            "error": "500:SERVER_ERROR",
            "error-details": "Sorry, this request resulted in an error!"
        };
    }
});

router["get"]("/", async function(ctx) {
    ctx.body = { "version": version };
});

const autocompletion = require("./controllers/autocomplete.js");
router["post"]("/v2/autocomplete", autocompletion);

const expand = require("./controllers/expand.js");
router["post"]("/expand", expand);

const expandGrouped = require("./controllers/expand_grouped.js");
router["post"]("/expand-grouped", expandGrouped);

const expandByString = require("./controllers/expand_by_string.js");
router["post"]("/expand-by-string", expandByString);

const port = process.env.PORT || config.port;

app.use(router.routes());
app.listen(port);

console.info("listening on port %d", port);
