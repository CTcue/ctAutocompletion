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
const getCategory  = require("../../lib/category.js");


const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ],
***REMOVED***);


const source = ["cui", "str", "pref", "types", "source"];


module.exports = function *() {
    var headers = this.req.headers;
    var body    = this.request.body;
    var query   = _.deburr(body.query);

***REMOVED*** Search for suggestions in Elasticsearch
    var exactMatches = yield findExact(query);


***REMOVED*** If no matches -> attempt spelling fixes
    var closeMatches = yield findMatches(query);

    if (!closeMatches.hits.length) {
        closeMatches = yield spellingMatches(query);
***REMOVED***


***REMOVED*** Find user added contributions (if needed)
    var likes = [];

    if (config.neo4j["is_active"] && this.user) {
        likes = yield findUserLikes(query, this.user._id, this.user.env);
***REMOVED***


***REMOVED*** Combine suggestions
    var combined = [].concat(exactMatches.hits, likes, closeMatches.hits);
    var allMatches = combined.map(function(item) {
        item["category"] = getCategory(item["types"], item["source"]);

        delete item["types"];
        delete item["source"];

        return item;
***REMOVED***);


***REMOVED*** If specific category is given, filter results
    if (_.has(body, "category")) {
        var wanted_category = _.get(body, "category") || "keyword";

        allMatches = _.filter(allMatches, function(m) {
            return m.category === wanted_category;
    ***REMOVED***);
***REMOVED***


***REMOVED*** Parse matches, for duplicates include it's category/pref_type
    var unique   = _.uniqBy(allMatches, s => s["pref"].trim().replace("-", " ").toLowerCase());
    var just_str = unique.map(s => s["str"].toLowerCase());

    unique = generateTerms(unique, just_str);

    var dupes = _.filter(just_str, function(value, index, iteratee) {
        return _.includes(iteratee, value, index+1);
***REMOVED***);


    for (var i=0; i < unique.length; i++) {
        if (_.includes(dupes, unique[i]["str"].toLowerCase())) {
            unique[i]["pref"] = unique[i]["pref"] + " (" + unique[i]["category"] + ")";
    ***REMOVED***
***REMOVED***


    this.body = {
        "took" : (exactMatches.took || 10) + (closeMatches.took || 20),
        "hits" : unique
***REMOVED***;
***REMOVED***;


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
        "size": 8,
        "query": {
            "function_score" : {
                "query" : {
                    "match_phrase" : {
                        "str" : query.trim()
                ***REMOVED***
            ***REMOVED***,

            ***REMOVED*** Slightly boost disease/disorders category
                "functions" : [
                    {
                        "filter": {
                            "terms": { "types": ["DISO", "PROC", "T200"] ***REMOVED***
                    ***REMOVED***,
                        "weight": 1.2
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
        "size": 6,
        "query": {
            "match" : {
                "str" : {
                    "query" : query.trim(),
                    "fuzziness": "AUTO",
                    "operator": "and",
                    "prefix_length"   : 4,
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

            if (hits && hits.total > 0) {
                for (var i=0; i < hits.hits.length; i++) {
                    result.push(hits.hits[i]._source);
            ***REMOVED***
        ***REMOVED***

            callback(err, {
                "took": res.took,
                "hits": _.sortBy(result, (t => t.str.length)),
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
            "pref"     : to_add[i],
            "cui"      : 'generated',
            "category" : 'keyword'
    ***REMOVED***);
***REMOVED***

    return [].concat(added, unique);
***REMOVED***