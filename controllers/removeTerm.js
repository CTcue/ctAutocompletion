
var config  = require('../config/config.js');
var elastic = require('elasticsearch');
var _       = require("lodash");
var sha1    = require("../lib/sha1");

// Database
var db    = require('monk')(config.mongodb.path);
var wrap  = require('co-monk');
var table = wrap(db.get('customTerms'));

var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
***REMOVED***);

module.exports = function *() {
    var body = this.request.body.object;

***REMOVED*** Filter out CUI codes that the user already selected
    var record = yield function(callback) {
        elasticClient.delete({
            "index" : 'autocomplete',
            "type"  : 'records',
            "id"    : sha1.sum(body.str.toLowerCase().trim())
    ***REMOVED***,
        function(err, resp) {
            callback(err, resp);
    ***REMOVED***);
***REMOVED***

    var synonyms = yield function(callback) {
        elasticClient.get({
            "index" : 'expander',
            "type"  : 'records',
            "id"    : body.cui
    ***REMOVED***,
        function(err, resp) {
            callback(err, resp);
    ***REMOVED***);
***REMOVED***

    if (synonyms) {
        var update = yield function(callback) {
            var filtered = _.reject(synonyms._source.str, function(str) {
              return str.toLowerCase() === body.str.toLowerCase();
        ***REMOVED***);

            elasticClient.update({
                "index" : 'expander',
                "type"  : 'records',
                "id"    : body.cui,
                "body"  : {
                    "doc" : {
                        "str" : filtered
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***,
            function(err, resp) {
                callback(err, resp);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***

    this.body = true;
***REMOVED***;
