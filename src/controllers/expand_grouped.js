
const _ = require("lodash");
const queryHelper = require("../lib/queryHelper");


module.exports = async function expandGrouped(ctx) {
    const cui = ctx.request.body.query || "";
    const result = await queryHelper.getTermsByCui(cui, 100);

    if (!result || _.isEmpty(result)) {
        ctx.body = {
            "pref": "",
            "terms": []
        };
    }

    ctx.body = queryHelper.groupTerms(result);
};
