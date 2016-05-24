"use strict";

/** Usage

    curl -X POST -H "Content-Type: application/json" -d '{
        "query": "cabg"
***REMOVED***' "http://localhost:4080/autocomplete"

*/

var config  = require('../config/config.js');

var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
***REMOVED***);


var guess_origin = require("./lib/guess_origin");
var Trie = require('./lib/trie');
var _ = require("lodash");


const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ]
***REMOVED***);


const source = ["cui", "str", "pref", "types"];


module.exports = function *() {
    var headers = this.req.headers;

***REMOVED*** Remove diacritics from query
    var query = _.deburr(this.request.body.query);

***REMOVED*** Check special matches, such as demographic options
    var specialMatches = yield findSpecial(query);

***REMOVED*** Lookup matches in Elasticsearch
    var exactMatches = yield findExact(query);
    var closeMatches = yield findMatches(query);

    var likes = [];

    if (config.neo4j["is_active"] && this.user) {
    ***REMOVED*** Find user added contributions
        likes = yield findUserLikes(query, this.user._id, this.user.env);
***REMOVED***

    this.body = {
        "took"   : exactMatches.took + closeMatches.took,
        "special": specialMatches,
        "error"  : exactMatches.hasOwnProperty("error"),
        "hits"   : _.uniq([].concat(exactMatches.hits, likes, closeMatches.hits), function(t) {
            return t["str"].toString().toLowerCase();
    ***REMOVED***)
***REMOVED***
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

function findExact(query) {
***REMOVED*** Exact term is indexed without dashes
    var wantedTerm = query
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();


    return function(callback) {
        var elastic_query =  {
            "_source": source,

            "size": 3,
            "query": {
                "term" : {
                    "exact" : wantedTerm
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        var queryObj = {
            "index" : 'autocomplete',
            "body"  : elastic_query
    ***REMOVED***;

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
                "hits": _.sortBy(result, (t => t.str.length))
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***
***REMOVED***


function findMatches(query) {
    var origin = guess_origin(query);

***REMOVED*** Filter out CUI codes that the user already selected
    return function(callback) {

    ***REMOVED*** DBC code check needs prefix matching
        if (origin === "code") {
            var elastic_query =  {
                "_source": source,
                "size": 6,

                "query": {
                    "match_phrase_prefix" : {
                        "str" : query.trim()
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
        ***REMOVED***
            var elastic_query =  {
                "_source": source,
                "size": 6,

                "query": {
                    "function_score" : {
                        "query" : {
                            "match_phrase" : {
                                "str" : query.trim()
                        ***REMOVED***
                    ***REMOVED***,

                        "functions" : [
                        ***REMOVED*** Prefer SnomedCT / MeSH
                        ***REMOVED*** {
                        ***REMOVED***     "filter": {
                        ***REMOVED***         "terms": { "source": ["SNOMEDCT_US", "MSH", "MSHDUT"] ***REMOVED***
                        ***REMOVED*** ***REMOVED***,
                        ***REMOVED***     "weight": 1.25
                        ***REMOVED*** ***REMOVED***,

                        ***REMOVED*** weight for some categories
                            {
                                "filter": {
                                    "terms": { "types": ["DISO"] ***REMOVED***
                            ***REMOVED***,
                                "weight": 1.8
                        ***REMOVED***
                        ]
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***

        var queryObj = {
            "index" : 'autocomplete',
            "body"  : elastic_query
    ***REMOVED***;

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




// Build regex objects for custom category checks
var TRIE = new Trie(config.demographic_types.mapping);
var LOOKUP = config.demographic_types.lookup;

function findSpecial(query) {
    var _query = query.trim().toLowerCase();

    return function(callback) {
        var result = false;
        var match = TRIE.search(_query);

    ***REMOVED*** Return first/best match if available
        if (match.length > 0) {
            var best = match[0];

        ***REMOVED*** Get category info from LOOKUP
            if (LOOKUP.hasOwnProperty(best.value)) {
                result = LOOKUP[best.value];

                result["use_template"] = true;
                result["cui"] = "custom";
                result["str"] = best.key;
        ***REMOVED***
    ***REMOVED***

        callback(false, result);
***REMOVED***
***REMOVED***
