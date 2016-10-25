"use strict";

/** Usage

  curl -X POST -H "Content-Type: application/json" -d '{
      "query": "C1306459"
  ***REMOVED***' "http://localhost:4080/expand-grouped"

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



module.exports = function *() {
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
            "_source": ["cui", "pref", "source"],
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


    var result = yield getTermsByCui(_.get(cuiResult, "cui"));
    var pref        = "";
    var found_terms = [];

    if (result) {
        pref        = result[0];
        found_terms = _.uniq( _.sortBy(result[1], "lang"), s => string.compareFn(s.str) );
***REMOVED***

***REMOVED*** Group terms by label / language
    var terms = {***REMOVED***;

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
            terms[key] = [ t["str"] ];
    ***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** for farma-compas terms => check for children to add as synonyms

    if (config.neo4j["is_active"] && _.get(cuiResult, "source") === "farma_compas") {
        var cui = _.get(cuiResult, "cui");

        var cypherObj = {
            "query"  : buildQuery(cui),
            "params" : {
                "A": cui,
        ***REMOVED***,

            "lean": true
    ***REMOVED***;

        var children = yield function(callback) {
            db.cypher(cypherObj, function(err, paths) {
                if (err) {
                  console.error(err);
                  return callback(false, [])
            ***REMOVED***

                if (!paths || paths.length < 1 || !_.get(paths[0], "children")) {
                    return callback(false, []);
            ***REMOVED***

                callback(null, paths[0]["children"].map(s => s["cui"]));
        ***REMOVED***);
    ***REMOVED***;


        for (var i=0; i < children.length; i++) {
            var child_synonyms = yield getTermsByCui(children[i], 2);

            if (!child_synonyms) {
                continue;
        ***REMOVED***

            var _pref = child_synonyms[0];
            var _terms = child_synonyms[1];

            terms[_pref] = [_pref].concat(_terms.map(s => s["str"]));
    ***REMOVED***
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
    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***), (t1)<-[:child_of]-(c) return COLLECT(c) as children`
***REMOVED***
