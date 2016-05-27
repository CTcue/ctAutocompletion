"use strict";

/** Usage

    curl -X POST -d '{
        "query": "C0006826"
    }' "https://ctcue.com/umls/related"

*/

const config  = require('../config/config.js');

const _ = require("lodash");
const queries = require("./_cypher/queries");
const _cypher = require("./_cypher/cypher");
const _elastic = require("./_cypher/expand_by_cui");

const neoQuery = {
    "children" : queries.__children(),
    "parents"  : queries.__parents(),
};


module.exports = function *() {
    var result = {
        "children": [],
        "parents" : [],
        // "siblings": []
    };

    // Obtain given "cui" parameter
    var body = this.request.body.query;
    var params = {
        "A": body,
    };

    if (!config.neo4j["is_active"]) {
        return this.body = result;
    }

    for (var k in result) {
        for (let cui of yield _cypher(params, neoQuery[k])) {
            var item = yield _elastic(cui);

            if (item) {
                result[k].push(item)
            }
        }
    }

    this.body = result;
};
