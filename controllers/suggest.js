"use strict";

/** Usage

    curl -X POST -d '{
        "query": [
            { "cui": "C0026187" },
            { "str": "rituximab" }
        ]
    }' "https://ctcue.com/umls/suggest"

*/

const _ = require("lodash");

const config  = require('../config/config.js');
const queries = require("./_cypher/queries");
const _cypher = require("./_cypher/cypher");
const _elastic = require("./_cypher/expand_by_cui");


const neoQuery = queries.__shared_parents();


module.exports = function *() {
    var body = this.request.body.query;

    if (body.length < 2 || !config.neo4j["is_active"]) {
        return this.body = [];
    }

    // Parameter input:
    // query: [CUI1, CUI2]
    var params = {
        "A": getCUI(body[0]),
        "B": getCUI(body[1]),
    };

    var result = [];

    for (let cui of yield _cypher(params, neoQuery)) {
        var item = yield _elastic(cui);

        if (item) {
            result.push(item)
        }
    }

    this.body = result;
};


function getCUI(param) {
    if (typeof param === "string") {
        return param;
    }
    else if (typeof param === "object") {
        return _.get(param, "cui");
    }

    return null;
}
