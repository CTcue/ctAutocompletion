
const config  = require("../../config/config.js");

const _ = require("lodash");

const elasticHelper = require("../lib/elasticHelper");
const elasticClient = elasticHelper.client();


const FIELDS = ["cui", "str", "pref"];


module.exports = async function autocomplete(ctx) {
    const start = Date.now();
    const body = ctx.request.body;
    const query = String(body.query).trim();

    // Limit to N characters input;
    const clean = _.deburr(query).slice(0, 42);

    if (!query || query === "") {
        ctx.body = {
            "took": Math.ceil(Date.now() - start),
            "hits": []
        };

        return;
    }


    const queryObj = {
        // TEMP/WIP (should be the autocompletion index)
        "index": "suggester-measurement",
        "size" : 15,

        "body": {
            "sort": [ { "hits": "desc" } ],

            "query": {
                "exists": { "field": "description" }
            }
        }
    };


    const response = await elasticClient.search(queryObj) || {};

    if (!response) {
        ctx.body = {
            "took": Math.ceil(Date.now() - start),
            "hits": []
        };

        return;
    }


    const hits = _.get(response, "hits.hits", []).map(r => {
        const source = _.get(r, "_source", {});

        return {
            "str" : _.get(source, "description.input"),
            "cui" : _.get(source, "cui", "C110912"),
            "pref": ""
        };
    });


    ctx.body = {
        "took": Math.ceil(Date.now() - start),
        "hits": hits
    };
};
