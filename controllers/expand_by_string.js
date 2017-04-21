"use strict";

/** Usage

  curl -X POST -H "Content-Type: application/json" -d '{
      "query": "C1306459"
  ***REMOVED***' "http://localhost:4080/expand-by-string"

*/


const config  = require('../config/config');

const _ = require("lodash");
const string = require("../lib/string");


const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase({
    "url": 'http://localhost:7474',
    "auth": config.neo4j
***REMOVED***);


const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ]
***REMOVED***);


const source = ["str", "lang", "pref"];

const language_map = {
    "DUT" : "dutch",
    "ENG" : "english"
***REMOVED***;



module.exports = function *(next) {
    var body = this.request.body;

    var term = _.get(body, "query") || null;
    var category = _.get(body, "category") || "keyword";


    if (!term || term.length < 3) {
        this.body = null;
        return;
***REMOVED***


***REMOVED*** Exact term is indexed without dashes
    var wantedTerm = term
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    var queryObj = {
        "index": "autocomplete",

        "size" : 1,

        "body": {
        ***REMOVED*** "_source": ["cui", "pref", "source"],
            "query": {
                "term" : {
                    "exact" : wantedTerm
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    var cuiResult = yield function(callback) {
        elasticClient.search(queryObj, function(err, resp) {
            if (err) {
                callback(false, false);
        ***REMOVED***

            callback(false, _.get(resp, "hits.hits.0._source") || false);
    ***REMOVED***);
***REMOVED***;


    if (!cuiResult) {
        this.body = null;
        return;
***REMOVED***


    var result      = yield getTermsByCui(_.get(cuiResult, "cui"));
    var pref        = "";
    var found_terms = [];

    if (result) {
        pref        = result[0];
        found_terms = _.uniq( _.sortBy(result[1], "lang"), s => string.compareFn(s.str) );
***REMOVED***


***REMOVED*** Group terms by label / language
    var terms = {
        "custom"   : [],
        "suggested": []
***REMOVED***;

    for (var i=0; i < found_terms.length; i++) {
        var t = found_terms[i];
        var key = "custom";

    ***REMOVED*** Skip two letter abbreviations
        if (!t["str"] || t["str"].length < 3) {
            continue;
    ***REMOVED***

        if (t.hasOwnProperty("label")) {
            key = t["label"].toLowerCase();
    ***REMOVED***
        else if (t.hasOwnProperty("lang")) {
            key = language_map[t["lang"]] || "custom";
    ***REMOVED***


        if (terms.hasOwnProperty(key)) {
            terms[key].push(t["str"]);
    ***REMOVED***
        ***REMOVED***
            terms[key] = [t["str"]];
    ***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** for farma-compas terms => check for children to add as synonyms

***REMOVED*** && _.get(cuiResult, "source") === "farma_compas"

    if (config.neo4j["is_active"] && _.get(cuiResult, "cui")) {
        var cui = _.get(cuiResult, "cui");

        var extra = yield findSuggestions(cui, { "brands": [], "related_brands": [] ***REMOVED***);

        terms = _.extend(terms, extra);
***REMOVED***



***REMOVED*** - Remove empty key/values
***REMOVED*** - Sort terms by their length

    for (var k in terms) {
        if (! terms[k].length) {
            delete terms[k];
    ***REMOVED***
        ***REMOVED***
            var unique = _.uniqBy(terms[k], s => string.forComparison(s));
            terms[k]   = _.sortBy(unique, "length");
    ***REMOVED***
***REMOVED***


    this.body = {
      "cui"      : _.get(cuiResult, "cui") || null,
      "pref"     : pref,
      "terms"    : terms,
      "uncheck"  : []
***REMOVED***;

***REMOVED*** For logging
    this.pref_term = pref;
    yield next;
***REMOVED***;


const queries  = require("./_cypher/queries");
const _cypher  = require("./_cypher/cypher");
const _elastic = require("./_cypher/expand_by_cui");

const neoQuery = {
    "children"  : queries.__children(),
    "brands"    : queries.__brands(),
    "related_brands": queries.__related_brands(),
    "siblings"  : queries.__siblings(),
***REMOVED***;


function * findSuggestions(findBy, result) {
    if (_.isEmpty(result)) {
        var result = {
        ***REMOVED*** "children": [],
        ***REMOVED*** "siblings": [],
            "brands" : []
    ***REMOVED***;
***REMOVED***

***REMOVED*** var result = {
***REMOVED***     "children": [],
***REMOVED***     "siblings": [],
***REMOVED***     "brands"  : []
***REMOVED*** ***REMOVED***;

***REMOVED*** Obtain given "cui" parameter
***REMOVED*** var body = this.request.body.query;
    var params = {
        "A": findBy,
***REMOVED***;

    for (var k in result) {
        if (!_.has(neoQuery, k)) {
            continue;
    ***REMOVED***

        for (let cui of yield _cypher(params, neoQuery[k])) {
            var item = yield _elastic(cui);

            if (item && _.has(item, "pref")) {
                result[k].push(item.pref)
        ***REMOVED***
    ***REMOVED***
***REMOVED***

    return result;
***REMOVED***;



function getTermsByCui(cui, size) {
    if (typeof size === "undefined") {
        size = 60;
***REMOVED***


    return function(callback) {
        if (!cui) {
            return callback(false, false);
    ***REMOVED***

        elasticClient.search({
            "index": 'autocomplete',
            "size": size,
            "sort": ["_doc"],
            "body" : {
                "query" : {
                    "term" : {
                        "cui" : cui
                 ***REMOVED***
             ***REMOVED***
        ***REMOVED***
    ***REMOVED***,
        function(err, resp) {
            if (resp && !!resp.hits && resp.hits.total > 0) {
                var hits = resp.hits.hits;

            ***REMOVED*** Return ES source part only
                if (hits.length > 0) {
                    var pref  = hits[0]._source.pref;

                    return callback(false, [pref, hits.map(s => s._source)]);
            ***REMOVED***
        ***REMOVED***
            ***REMOVED***
                callback(false, false);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;
***REMOVED***


function buildQuery(cui) {
***REMOVED*** return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***),
***REMOVED***     (t1)<-[:child_of]-(c)
***REMOVED***         return COLLECT(distinct c) as children`

***REMOVED*** Too much results if brands are included

    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***),
        (t1)<-[:child_of]-(c),
        (t1)<-[:brand]-(b)
            return COLLECT(distinct c) as children,
                   COLLECT(distinct b) as brands`

***REMOVED*** return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***),
***REMOVED***     (t1)<-[:child_of]-(c)
***REMOVED***         return COLLECT(distinct c) as children`


***REMOVED*** return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***),
***REMOVED***     (t1)<-[:brand]-(b)
***REMOVED***         return COLLECT(distinct b) as brands`
***REMOVED***
