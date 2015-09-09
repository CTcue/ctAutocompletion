
var config = require('../config/config.js');
var elastic = require('elasticsearch');
var uuid   = require('node-uuid');
var _      = require("lodash");
var sha1   = require("../lib/sha1");

// Database
var db    = require('monk')(config.mongodb.path);
var wrap  = require('co-monk');
var table = wrap(db.get('customTerms'));

var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
***REMOVED***);

module.exports = function *() {
    var body = this.request.body;
    var cui = (!!body.cui && body.cui.length) ? body.cui : uuid.v4();

***REMOVED*** Insert custom term request in mongoDB
    if (!!body.custom) {
        var added = {
            "user"    : body.user,
            "created" : new Date(),
            "added"   : body.custom,
            "object"  : {
                "cui"  : cui,
                "term" : body.term
        ***REMOVED***
    ***REMOVED***;

        var mongoResult = yield table.insert(added);
***REMOVED***

    /*
    for (var i=0, L=body.synonyms.length; i < L; i++) {
        var term  = body.synonyms[i].trim();

        cui = yield addAutocompleteTerm(cui, term);
***REMOVED***
    */

    this.body = yield getExpandList(cui, body.synonyms);
***REMOVED***;


// Returns cui of item inserted
function addAutocompleteTerm(cui, term) {
    return function(callback) {
        var id = sha1.sum(term.toLowerCase());

        var newDocument = {
            "index" : "autocomplete",
            "type"  : "records",
            "id"    : id,
            "fields" : "_source",

            "body"  : {
                "doc" : {***REMOVED***,

                "upsert" : {
                  "cui" : cui,
                  "str" : term
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        elasticClient.update(newDocument, function(err, response) {
            callback(err, response.get._source.cui);
    ***REMOVED***);
***REMOVED***
***REMOVED***

function addExpandList(cui, terms) {
***REMOVED*** Scripting in production is disabled
***REMOVED*** Place following script inside: /etc/elasticsearch/scripts/uniqueTerms.groovy

    var uniqueTermsScript = "for (term in terms) { if (!ctx._source.str.contains(term)){ ctx._source.str += term; ***REMOVED*** ***REMOVED***";

    return function(callback) {
        var updateDocument = {
            "index"  : "expander",
            "type"   : "records",
            "id"     : cui,
            "fields" : "_source",

            "body"  : {
                "script": (process.env.NODE_ENV === "production" ? "uniqueTerms" : uniqueTermsScript),
                "lang"  : "groovy",
                "params" : {
                    "terms" : terms
            ***REMOVED***,

                "upsert" : {
                    "cui" : cui,
                    "str" : terms
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;

        elasticClient.update(updateDocument, function(err, response) {
            callback(err, response.get._source);
    ***REMOVED***);
***REMOVED***
***REMOVED***

function getExpandList(cui, terms) {
    return function(callback) {
          elasticClient.search({
              "index" : 'expander',
              "type"  : 'records',
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
                callback(false, resp.hits.hits[0]._source);
          ***REMOVED***
              ***REMOVED***
                callback(err, []);
          ***REMOVED***
      ***REMOVED***);
***REMOVED***;
***REMOVED***
