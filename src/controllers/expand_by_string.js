
/** Usage

  curl -X POST -H "Content-Type: application/json" -d "{
      "query": "C1306459"
  }" "http://localhost:4080/expand-by-string"

*/

const _ = require("lodash");
const elasticHelper = require("../lib/elasticHelper");
const elasticClient = elasticHelper.client();

const queryHelper = require("../lib/queryHelper");

module.exports = async function expandByString(ctx) {
    const term = ctx.request.body.query || "";

    if (!term || term.length < 3) {
        ctx.body = null;
        return;
    }

    // Exact term is indexed without dashes
    const wantedTerm = term
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const queryObj = {
        "index" : "autocomplete",
        "size"  : 1,

        "body": {
            "_source": { "includes": ["cui"] },

            "query": {
                "term" : {
                    "exact": wantedTerm
                }
            }
        }
    };

    const cuiResponse = await elasticClient.search(queryObj);

    if (!cuiResponse) {
        ctx.body = null;
        return;
    }

    const cuiResult = _.get(cuiResponse, "hits.hits.0._source");

    if (!cuiResult) {
        ctx.body = null;
        return;
    }

    const result = await queryHelper.getTermsByCui(cuiResult.cui, 100);

    if (!result || _.isEmpty(result)) {
        ctx.body = {
            "pref": "",
            "terms": []
        };
    }

    const grouped = queryHelper.groupTerms(result);
    grouped.cui = cuiResult.cui;

    ctx.body = grouped;
};
