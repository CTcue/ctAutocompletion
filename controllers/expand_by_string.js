
/**
 * Usage:
 *   curl -X POST -H "Content-Type: application/json" -d '{"query": "Diabetes Mellitus"}' http://localhost:4080/expand-by-string
 */

const config  = require("../config/config");

const _ = require("lodash");
const queryHelper = require("../lib/queryHelper");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

/** @deprecated */
module.exports = async function(ctx) {
    const body = ctx.request.body;
    const term = String(body.query);

    if (!term || term.length < 3) {
        ctx.body = {
            cui: "",
            pref: "",
            terms: {},
            uncheck: []
        };
        return;
    }

    // Exact term is indexed without dashes
    const wantedTerm = term
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const query = {
        "index": config.elasticsearch.index,
        "size": 1,
        "body": {
            "query": {
                "term": {
                    "exact": wantedTerm
                }
            }
        }
    };

    const response = await elasticClient.search(query);
    const cuiResult = _.get(response.body, "hits.hits.0._source", {});

    if (!cuiResult) {
        ctx.body = {
            cui: "",
            pref: "",
            terms: {},
            uncheck: []
        };
        return;
    }

    const cui = _.get(cuiResult, "cui", "");
    const { terms, pref } = await queryHelper.getTermsByLanguage(cui);

    ctx.body = {
        cui: cui,
        pref: pref,
        terms: terms,
        uncheck: []
    };
};
