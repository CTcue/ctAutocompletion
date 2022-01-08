/**
 * Usage:
 *   curl -X POST -H "Content-Type: application/json" -d '{"query":"C1306459"}' http://localhost:4080/expand
 */

const _ = require("lodash");
const config = require("../config/config.js");
const stringLib = require("../lib/string");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

module.exports = async function(ctx) {
    const body = ctx.request.body;
    const cui = String(body.query);

    if (!cui) {
        ctx.body = { terms: [] };
    }

    const query = {
        "index": config.elasticsearch.index,
        "size": 100,
        "sort": ["_doc"],
        "_source": ["str"],
        "body": {
            "query": {
                "term": {
                    "cui": cui
                }
            }
        }
    };

    const response = await elasticClient.search(query);
    const result = _.get(response.body, "hits.hits", []);

    const cleaned = [];

    if (result && result.length > 0) {
        const terms = result.map(s => s._source.str);
        const unique = _.uniqBy(terms, stringLib.compareFn);

        cleaned.push(...unique);
    }

    ctx.body = { terms: cleaned };
};
