
/** Module dependencies. */

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


var elastic = require('elasticsearch');
var elasticClient = new elastic.Client();


const source = ["cui", "str", "exact", "pref", "source", "types"];

// Build regex objects for demographic check
var DEMOGRAPHICS = new Trie(config.demographic_types);


module.exports = function *() {
    var headers = this.req.headers;


    var query = this.request.body.query;

***REMOVED*** Check special matches, such as demographic options
    var specialMatches = yield findSpecial(query);

***REMOVED*** Lookup matches in Elasticsearch
    var exactMatches = yield findExact(query);
    var closeMatches = yield findMatches(query);

    var likes = [];

    if (headers.hasOwnProperty("x-user")) {
    ***REMOVED*** user_id => environment
        var user_header = headers["x-user"].split("=>");

        if (user_header.length === 2 && user_header[0].length > 1 && user_header[1].length > 1) {
            var userId = user_header[0];
            var env    = user_header[1].toLowerCase().trim();

        ***REMOVED*** Find user added contributions
            likes = yield findUserLikes(query, userId, env);
    ***REMOVED***
***REMOVED***


    this.body = {
        "took": exactMatches.took + closeMatches.took,
        "special": specialMatches,
        "error"  : exactMatches.hasOwnProperty("error"),
        "hits": _.uniq([].concat(exactMatches.hits, likes, closeMatches.hits), "exact")
***REMOVED***
***REMOVED***;


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
              "_QUERY_": "(?i)" + query + ".*"
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
                    s["pref"] = s["str"];
                    s["contributed"] = true;

                    return s;
            ***REMOVED***)

                callback(false, result);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***
***REMOVED***

function findExact(query) {
    var wantedTerm = query.trim().toLowerCase();

***REMOVED*** Filter out CUI codes that the user already selected
    return function(callback) {
        var elastic_query =  {
            "_source": source,

            "size": 3,

            "query": {
                "dis_max" : {
                    "tie_breaker" : 0.7,

                    "queries" : [
                        {
                            "term" : {
                                "exact" : wantedTerm
                        ***REMOVED***,
                    ***REMOVED***,

                        {
                            "multi_match": {
                                "type": "most_fields",
                                "query": wantedTerm,
                                "fields": [ "exact", "exact.folded" ]
                        ***REMOVED***
                    ***REMOVED***
                    ]
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
                "hits": result
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
                            {
                                "filter": {
                                    "terms": { "source": ["SNOMEDCT_US", "MSH", "MSHDUT"] ***REMOVED***
                            ***REMOVED***,
                                "weight": 1.25
                        ***REMOVED***,

                        ***REMOVED*** Negative weight for some categories
                            {
                                "filter": {
                                    "terms": { "types": ["Health Care Activity", "Biomedical Occupation or Discipline"] ***REMOVED***
                            ***REMOVED***,
                                "weight": 0.7
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
                "hits": result
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***
***REMOVED***


function findSpecial(query) {
    var _query = query.trim().toLowerCase();

    return function(callback) {
        var result = false;
        var match = DEMOGRAPHICS.search(_query)

        if (match.length > 0) {
            var split = match[0]["value"].split(":");

            var label = split[0];
            var value = false;

            if (split[1]) {
                label = split[0] + ": " + split[1];

                value = {***REMOVED***;
                value[split[0]] = split[1];
        ***REMOVED***

            var result = {
                "str"      : label,
                "value"    : value,
                "pref"     : "demographic",
                "cui"      : "custom",
                "category" : "demographic"
        ***REMOVED***
    ***REMOVED***

        callback(false, result);
***REMOVED***
***REMOVED***
