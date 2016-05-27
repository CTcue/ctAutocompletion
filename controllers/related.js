"use strict";

/** Usage

    curl -X POST -d '{
        "query": "C0006826"
***REMOVED***' "https://ctcue.com/umls/related"

*/

const config  = require('../config/config.js');

const _ = require("lodash");
const queries = require("./_cypher/queries");
const _cypher = require("./_cypher/cypher");
const _elastic = require("./_cypher/expand_by_cui");

module.exports = function *() {
    var result = {
        "children": [],
        "parents" : [],
    ***REMOVED*** "siblings": []
***REMOVED***;

***REMOVED*** Obtain given "cui" parameter
    var body = this.request.body.query;
    var params = {
        "A": body,
***REMOVED***;

    if (!config.neo4j["is_active"]) {
        return this.body = result;
***REMOVED***


    for (let cui of yield _cypher(params, queries.__children())) {
        var item = yield _elastic(cui);

        if (item) {
            result["children"].push(item)
    ***REMOVED***
***REMOVED***

    for (let cui of yield _cypher(params, queries.__parents())) {
        var item = yield _elastic(cui);

        if (item) {
            result["parents"].push(item)
    ***REMOVED***
***REMOVED***

***REMOVED*** for (let cui of yield _cypher(params, queries.__siblings())) {
***REMOVED***     var item = yield _elastic(cui);

***REMOVED***     if (item) {
***REMOVED***         result["siblings"].push(item)
***REMOVED*** ***REMOVED***
***REMOVED*** ***REMOVED***

    this.body = result;
***REMOVED***;
