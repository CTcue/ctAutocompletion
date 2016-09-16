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

const Trie = require('../lib/trie');
const guess_origin = require("../lib/guess_origin");
const getCategory = require("../lib/category.js");


const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ],
***REMOVED***);

const source = ["cui", "str", "pref", "types"];


module.exports = function *() {
    var headers = this.req.headers;

***REMOVED*** Remove diacritics from query
    var query = _.deburr(this.request.body.query);
    var query_type = guess_origin(query);

***REMOVED*** Lookup matches in Elasticsearch
    var exactMatches = yield findExact(query, query_type);

    var likes = [];
    var specialMatches = [];
    var closeMatches   = {"hits": []***REMOVED***;

***REMOVED*** Default query_type
***REMOVED*** Check special matches, such as demographic options
    if (query_type === "default") {
        closeMatches = yield findMatches(query);

    ***REMOVED*** Find user added contributions (if needed)
        if (config.neo4j["is_active"] && this.user) {
            likes = yield findUserLikes(query, this.user._id, this.user.env);
    ***REMOVED***
***REMOVED***

    var allMatches = [].concat(exactMatches.hits, likes, closeMatches.hits).map(function(item) {
        item["category"] = getCategory(item["types"]);

        delete item["types"];
        return item;
***REMOVED***);


***REMOVED*** Parse matches, for duplicates include it's category/pref_type
    var unique = _.uniqBy(allMatches, s => s["pref"].trim().replace("-", " ").toLowerCase());

    var just_str = unique.map(s => s["str"].toLowerCase());
    var dupes = _.filter(just_str, function(value, index, iteratee) {
       return _.includes(iteratee, value, index+1);
***REMOVED***);


    for (var i=0; i < unique.length; i++) {
        if (_.includes(dupes, unique[i]["str"].toLowerCase())) {
            unique[i]["pref"] = unique[i]["pref"] + " (" + unique[i]["category"] + ")";
    ***REMOVED***
***REMOVED***


    this.body = {
        "took"   : (exactMatches.took || 10) + (closeMatches.took || 20),
        "special": specialMatches,
        "hits"   : unique
***REMOVED***;
***REMOVED***;


function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\***REMOVED***\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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
              "_QUERY_": "(?i)" + escapeRegExp(query) + ".*"
        ***REMOVED***,

            "lean": true
    ***REMOVED***

        db.cypher(cypherObj, function(err, res) {
            if (err) {
                console.log(err);
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

function findExact(query, query_type) {
    var queryObj = {***REMOVED***;

    if (query_type === "cui") {
        queryObj["body"] = {
            "_source": source,
            "size": 4,
            "query": {
                "term" : {
                    "cui" : query
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        queryObj["index"] = "autocomplete";
***REMOVED***
    ***REMOVED***
    ***REMOVED*** Exact term is indexed without dashes
        var wantedTerm = query
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

        queryObj["body"] = {
            "_source": source,
            "size": 3,
            "query": {
                "term" : {
                    "exact" : wantedTerm
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        queryObj["index"] = "autocomplete";
***REMOVED***

***REMOVED*** console.log(JSON.stringify(queryObj, null, 2))

    return getResults(queryObj);
***REMOVED***


function findMatches(query) {
    var queryObj = {***REMOVED***;

    queryObj["index"] = "autocomplete";
    queryObj["body"] =  {
        "_source": source,
        "size": 6,
        "query": {
            "function_score" : {
                "query" : {
                    "match_phrase" : {
                        "str" : query.trim()
                ***REMOVED***
            ***REMOVED***,

            ***REMOVED*** Boost disease/disorders category
                "functions" : [
                    {
                        "filter": {
                            "terms": { "types": ["DISO", "PROC", "T200"] ***REMOVED***
                    ***REMOVED***,
                        "weight": 1.5
                ***REMOVED***
                ]
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
