
/**
 * Usage:
 *   curl -X POST -H "Content-Type: application/json" -d '{"query":"C1306459"}' http://localhost:4080/expand
*/

const _ = require("lodash");
const config = require("../config/config.js");
const string = require("../lib/string");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

module.exports = function* () {
    const body = this.request.body;
    const cui = _.get(body, "query", "");

    if (!cui) {
        this.body = { "terms": [] }
    }

    const result = yield function (callback) {
        elasticClient.search({
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
        },
            function (err, esRes) {
                const resp = esRes.body;

                if (resp && resp.hits && resp.hits.hits && resp.hits.hits.length) {
                    callback(false, resp.hits.hits);
                }
                else {
                    callback(err, []);
                }
            });
    };

    if (result && result.length > 0) {
        const terms = result.map(s => s._source.str);

        return this.body = {
            "terms": _.uniqBy(terms, string.compareFn),
        };
    }

    this.body = { "terms": [] };
};
