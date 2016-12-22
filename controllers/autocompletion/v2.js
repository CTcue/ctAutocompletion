"use strict";

/** Usage

    curl -X POST -H "Content-Type: application/json" -d '{
        "query": "cabg"
***REMOVED***' "http://localhost:4080/autocomplete"

*/

const config  = require('../../config/config.js');
const _ = require("lodash");

const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase({
    "url": 'http://localhost:7474',
    "auth": config.neo4j,
***REMOVED***);

const string = require("../../lib/string");

const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ],
***REMOVED***);


const source = ["cui", "str", "pref"];


module.exports = function *() {
    var headers = this.req.headers;
    var body    = this.request.body;
    var query   = _.deburr(body.query);

***REMOVED*** Search for suggestions in Elasticsearch
    var exactMatches = yield findExact(query);
    var exactHits = [];

***REMOVED*** Filter exact hits for uniqueness
    if (exactMatches.hits.length) {
        exactHits =  _.uniqBy(exactMatches.hits, s => s["pref"].trim().replace("-", " ").toLowerCase());
***REMOVED***


***REMOVED*** If no matches -> attempt spelling fixes
    var closeMatches = yield findMatches(query);
    var misspelledMatches = { "hits": [] ***REMOVED***;

    if (!closeMatches.hits.length || (query.length > 4 && closeMatches.hits.length < 4)) {
        misspelledMatches = yield spellingMatches(query);
***REMOVED***


***REMOVED*** Find user added contributions (if needed)
    var likes = [];

    if (config.neo4j["is_active"] && this.user) {
        likes = yield findUserLikes(query, this.user._id, this.user.env);
***REMOVED***

***REMOVED*** Combine suggestions
    var allMatches = [].concat(exactHits, likes, closeMatches.hits, misspelledMatches.hits);

***REMOVED*** Also check for common appendixes (STADIUM, STAGE, etc.)
    var just_str = allMatches.map(s => s["str"].toLowerCase());
    var unique = generateTerms(allMatches, just_str);


    this.body = {
        "took" : (exactMatches.took || 10) + (closeMatches.took || 20),
        "hits" : reducePayload(unique)
***REMOVED***;
***REMOVED***;


// Groups by CUI and strips 'pref' if it's exactly the same as str
function reducePayload(terms) {

    var result = [];
    var grouped = _.groupBy(terms, "cui");

    for (var cui in grouped) {
        var tmp = grouped[cui][0];

        if (grouped[cui].length > 1) {
            tmp.pref = _.uniqBy(grouped[cui].map(s => s["pref"].trim().replace("-", " ").toLowerCase())).join(", ");

            result.push(tmp)
    ***REMOVED***
        ***REMOVED***
            if (tmp.str.toLowerCase() === tmp.pref.toLowerCase()) {
                tmp["pref"] = "";
        ***REMOVED***

            result.push(tmp)
    ***REMOVED***
***REMOVED***

    return result;
***REMOVED***


function findExact(query) {
***REMOVED*** Exact term is indexed without dashes
    var wantedTerm = string.removeDashes(query);

    var queryObj = {
        "index": "autocomplete",
        "size" : 4,
        "body": {
            "_source": source,
            "query": {
                "term" : {
                    "exact" : wantedTerm
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    return getResults(queryObj);
***REMOVED***


function findUserLikes(query, userId, environment) {
    ***REMOVED*** For now, only get the "Dislikes" to uncheck stuff
    return function(callback) {

        var cypherObj = {
            "query": `MATCH
                        (s:Synonym)<-[r:LIKES]-(u:User { id: { _USER_ ***REMOVED***, env: { _ENV_ ***REMOVED*** ***REMOVED***)
                      WHERE
                        s.str =~ {_QUERY_***REMOVED***
                      RETURN
                        s.str as str, s.label as label, s.cui as cui`,

            "params": {
              "_USER_": userId,
              "_ENV_" : environment,
              "_QUERY_": "(?i)" + string.escapeRegExp(query) + ".*"
        ***REMOVED***,

            "lean": true
    ***REMOVED***

        db.cypher(cypherObj, function(err, res) {
            if (err) {
                console.error(err);
                callback(false, []);
        ***REMOVED***
            ***REMOVED***
                var result = res.map(function(s) {
                ***REMOVED*** For display / uniqueness test
                    s["pref"]  = s["str"];
                    s["exact"] = s["str"];
                    s["contributed"] = true;

                    return s;
            ***REMOVED***)

                callback(false, result);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***
***REMOVED***


function findMatches(query) {
    var queryObj = {***REMOVED***;

    queryObj["index"] = "autocomplete";
    queryObj["body"] =  {
        "_source": source,
        "size": 14,
        "query": {
            "function_score" : {
                "query" : {
                    "match_phrase" : {
                        "str" : query.trim()
                ***REMOVED***
            ***REMOVED***,

                "functions" : [
                    {
                    ***REMOVED*** Prefer some sources
                        "filter": {
                            "terms": { "source": [ "SNOMEDCT_US", "MSHDUT", "MDRDUT"] ***REMOVED***
                    ***REMOVED***,
                        "weight": 1
                ***REMOVED***,

                    {
                    ***REMOVED*** Boost disease/disorders category
                        "filter": {
                            "terms": { "types": ["DISO", "PROC"] ***REMOVED***
                    ***REMOVED***,
                        "weight": 2
                ***REMOVED***
                ]
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    return getResults(queryObj);
***REMOVED***



function spellingMatches(query) {
    var queryObj = {***REMOVED***;

    queryObj["index"] = "autocomplete";
    queryObj["body"] =  {
        "_source": source,
        "size": 5,
        "query": {
            "match" : {
                "str" : {
                    "query" : query.trim(),
                    "fuzziness": "AUTO",
                    "operator": "AND",
                    "prefix_length"   : 2,
                    "max_expansions"  : 10
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;

    return getResults(queryObj);
***REMOVED***


function getResults (queryObj) {
    return function(callback) {
        elasticClient.search(queryObj, function(err, res) {
            if (err) {
                return callback(false, { "error": true, "took": 10, "hits": []***REMOVED***)
        ***REMOVED***

            var hits = res.hits;
            var result = [];

        ***REMOVED*** console.log(JSON.stringify(hits, null, 4))

            if (hits && hits.total > 0) {

                result = hits.hits.map(function(hit) {
                    var tmp = hit["_source"];
                    ***REMOVED*** tmp["_score"] = hit["_score"];

                    return tmp;
            ***REMOVED***);
        ***REMOVED***

        ***REMOVED*** _.sortBy(result, (t => t.str.length))

            callback(err, {
                "took": res.took,
                "hits": result,
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***
***REMOVED***



// Add custom terms if there is a certain pattern:
// - Gleason score 5
// - Diabetes mellitus type 2
// - Diabetes mellitus type II
// - etc.

function generateTerms(unique, strings) {
    var generated = _.map(strings, string.replaceAppendix);

    var to_add = _.uniq(_.filter(generated, function(s) {
        return !_.includes(strings, s);
***REMOVED***));


    var added = [];
    for (var i=0; i < to_add.length; i++) {
        added.push({
            "str"      : to_add[i],
            "pref"     : "",
            "cui"      : 'generated',
    ***REMOVED***);
***REMOVED***

    return [].concat(added, unique);
***REMOVED***