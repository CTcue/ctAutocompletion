"use strict";

/** Usage

  curl -X POST -H "Content-Type: application/json" -d '{
      "query": "C1306459"
  ***REMOVED***' "http://localhost:4080/expand-grouped"

*/


const config  = require('../config/config.js');
const neo4j = require('neo4j');
const _ = require("lodash");
const string = require("../lib/string");
const getCategory = require("../lib/category");

const db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
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


const source = ["str", "lang", "types", "pref"];

const language_map = {
    "DUT" : "dutch",
    "ENG" : "english"
***REMOVED***;



module.exports = function *(next) {
    var body = this.request.body.query;

    var result = yield function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "size": 100,

            "sort": ["_doc"],
            "_source": source,

            "body" : {
                "query" : {
                    "term" : {
                        "cui" : body
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
                    var types = hits[0]._source.types;

                    return callback(false, [types, pref, hits.map(s => s._source)]);
            ***REMOVED***
        ***REMOVED***
            ***REMOVED***
                callback(false, false);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;


    var pref        = "";
    var types       = [];
    var found_terms = [];

    if (result) {
        types       = result[0];
        pref        = result[1];
        found_terms = result[2];

        found_terms = _.uniq( _.sortBy(found_terms, "lang"), s => string.compareFn(s.str) );
***REMOVED***


***REMOVED*** Check for user contributions
***REMOVED*** - If the current user added custom concepts/synonyms
***REMOVED*** if (config.neo4j["is_active"]) {
***REMOVED***     if (this.user) {
***REMOVED***         var user_contributed = yield function(callback) {
***REMOVED***             var cypherObj = {
***REMOVED***                 "query": `MATCH
***REMOVED***                             (s:Synonym {cui: {_CUI_***REMOVED*** ***REMOVED***)<-[r:LIKES]-(u:User { id: { _USER_ ***REMOVED***, env: { _ENV_ ***REMOVED*** ***REMOVED***)
***REMOVED***                           RETURN
***REMOVED***                             s.str as str, s.label as label`,

***REMOVED***                 "params": {
***REMOVED***                     "_CUI_"  : body,
***REMOVED***                     "_USER_" : this.user._id,
***REMOVED***                     "_ENV_"  : this.user.env
***REMOVED***             ***REMOVED***,

***REMOVED***                 "lean": true
***REMOVED***         ***REMOVED***


***REMOVED***             db.cypher(cypherObj, function(err, res) {
***REMOVED***                 if (err) {
***REMOVED***                     console.error(err);
***REMOVED***                     callback(false, []);
***REMOVED***             ***REMOVED***
***REMOVED***                 ***REMOVED***
***REMOVED***                     callback(false, res);
***REMOVED***             ***REMOVED***
***REMOVED***         ***REMOVED***);
***REMOVED***     ***REMOVED***

***REMOVED***     ***REMOVED*** Add user contributions
***REMOVED***         if (user_contributed && user_contributed.length) {
***REMOVED***             found_terms = found_terms.concat(user_contributed);
***REMOVED***     ***REMOVED***
***REMOVED*** ***REMOVED***


***REMOVED*** ***REMOVED*** Check if anyone (any user) has unchecked concepts/synonyms
***REMOVED*** ***REMOVED*** - Need more than 1 "downvote"
***REMOVED***     var uncheck = yield function(callback) {
***REMOVED***         var cypherObj = {
***REMOVED***             "query": `MATCH
***REMOVED***                         (s:Synonym {cui: {_CUI_***REMOVED*** ***REMOVED***)<-[r:DISLIKES]-(u:User)
***REMOVED***                       WITH
***REMOVED***                         type(r) as rel, s, count(s) as amount
***REMOVED***                       WHERE
***REMOVED***                         amount > 1
***REMOVED***                       RETURN
***REMOVED***                         s.str as term, s.label as label, rel, amount`,

***REMOVED***             "params": {
***REMOVED***               "_CUI_": body
***REMOVED***         ***REMOVED***,

***REMOVED***             "lean": true
***REMOVED***     ***REMOVED***

***REMOVED***         db.cypher(cypherObj, function(err, res) {
***REMOVED***             if (err) {
***REMOVED***                 console.info(err);
***REMOVED***                 callback(false, []);
***REMOVED***         ***REMOVED***
***REMOVED***             ***REMOVED***
***REMOVED***                 callback(false, res);
***REMOVED***         ***REMOVED***
***REMOVED***     ***REMOVED***);
***REMOVED*** ***REMOVED***
***REMOVED*** ***REMOVED***



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


        if (terms.hasOwnProperty("custom")) {
            terms["custom"].push(t["str"]);
    ***REMOVED***
        ***REMOVED***
            terms["custom"] = [ t["str"] ];
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
      "category" : getCategory(types),
      "pref"     : pref,
      "terms"    : terms,
      "uncheck"  : []
***REMOVED***;


***REMOVED*** For logging
    this.pref_term = pref;
    yield next;
***REMOVED***;
