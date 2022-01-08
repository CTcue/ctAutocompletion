/**
 * Usage:
 *   curl -X POST -H "Content-Type: application/json" -d '{"query":"C1306459"}' http://localhost:4080/expand-grouped
 */

const queryHelper = require("../lib/queryHelper");
const getCategory = require("../lib/category");

/** @deprecated */
module.exports = async function(ctx) {
    const body = ctx.request.body;
    const cui = String(body.query);

    const { terms, pref, types } = await queryHelper.getTermsByLanguage(cui);

    ctx.body = {
        pref: pref,
        terms: terms,
        category: getCategory(types),
        uncheck: []
    };
};
