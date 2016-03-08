'use strict';

var db    = require('../../lib/database');
var table = db.table('umls');

var elastic = require('elasticsearch');
var elasticClient = new elastic.Client();


module.exports = function *(next) {

    var body = this.request.body.query;

***REMOVED*** Add element to elasticsearch
    var cui = body.cui || "CT" + new Date().getTime();
    var term = body.synonym.term.trim() || false;

    if (! term) {
        return this.body = false;
***REMOVED***

    var newDocument = {
        "index" : "autocomplete",
        "type"  : "records",

        "body"  : {
            "cui"   : cui,
            "pref"  : term,           ***REMOVED*** TODO if cui is set, find UMLS preferred term
            "str"   : term.toLowerCase(), // Indexed for autocompletion
            "exact" : term,           ***REMOVED*** Indexed for exact term lookup

            "votes"  : 10,            ***REMOVED*** Start with 10 for now
            "lang"   : body.language || "ENG",
            "source" : "CTcue",
            "types"  : [body.types] || []
    ***REMOVED***
***REMOVED***;


    var esResult = yield function(callback) {
        elasticClient.create(newDocument, function(err, response) {
            if (err) {
                callback(false, false);
        ***REMOVED***
            ***REMOVED***
                callback(false, response);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

    if (esResult) {
    ***REMOVED*** Update document with _added and reference to elasticsearch
        var updated = yield table.findAndModify(
          { "_id": body._id ***REMOVED***,
          { "$set" : {  "_added": true, "_elasticId": esResult._id ***REMOVED*** ***REMOVED***);
***REMOVED***

    this.body = true;
***REMOVED***;
