
var config  = require('../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
***REMOVED***);


var elastic = require('elasticsearch');
var elasticClient = new elastic.Client();

var getCategory = require("./lib/category.js");

const source = ["str", "lang", "types"];
const language_map = {
    "DUT" : "dutch",
    "ENG" : "english",
    "default": "custom"
***REMOVED***;

module.exports = function *() {

    var body = this.request.body.query;

    var result = yield function(callback) {
        elasticClient.search({
            "index" : 'autocomplete',
            "size": 100,

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
                callback(false, resp.hits.hits);
        ***REMOVED***
            ***REMOVED***
                callback(err, []);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;

***REMOVED*** Custom terms don't have any "expanded" items usually
    if (result && result.length > 0) {

        var uncheck = [];

        if (config.neo4j["is_active"]) {
        ***REMOVED*** For now, only get the "Dislikes" to uncheck stuff
            uncheck = yield function(callback) {

                var cypherObj = {
                    "query": `MATCH
                                (s:Synonym {cui: {_CUI_***REMOVED*** ***REMOVED***)<-[r:DISLIKES]-(u:User)
                              WITH
                                type(r) as rel, s, count(s) as amount
                              WHERE
                                amount > 1
                              RETURN
                                s.str as term, s.label as label, rel, amount`,

                    "params": {
                      "_CUI_": body
                ***REMOVED***,

                    "lean": true
            ***REMOVED***

                db.cypher(cypherObj, function(err, res) {
                    if (err) {
                        console.log(err);
                        callback(false, []);
                ***REMOVED***
                    ***REMOVED***
                        callback(false, res);
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***


        var types = result[0]._source.types;

        var terms = {
            "english" : [],
            "dutch"   : [],
            "custom"  : []
    ***REMOVED***;

    ***REMOVED*** Group terms by language
        for (var i=0; i < result.length; i++) {
            var lang = result[i]["_source"]["lang"];

            if (! language_map.hasOwnProperty(lang)) {
                lang = "default";
        ***REMOVED***

            terms[language_map[lang]].push(result[i]["_source"]["str"]);
    ***REMOVED***


    ***REMOVED*** - Remove empty key/values
    ***REMOVED*** - Sort terms by their length
        for (var k in terms) {
            if (! terms[k].length) {
                delete terms[k];
        ***REMOVED***
            ***REMOVED***
                terms[k] = _.sortBy(terms[k], "length");
        ***REMOVED***
    ***REMOVED***


        return this.body = {
          "category"  : getCategory(types),
          "terms"     : terms,
          "uncheck"   : uncheck
    ***REMOVED***;
***REMOVED***


    this.body = { "custom": true, "terms": [], "category": "keyword", "uncheck": [] ***REMOVED***;
***REMOVED***;

