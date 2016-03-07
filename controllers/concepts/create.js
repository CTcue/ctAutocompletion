'use strict';

var db    = require('../../lib/database');
var table = db.table('umls');

var elastic = require('elasticsearch');
var elasticClient = new elastic.Client();


// Same as upload weight function
// Except it assumes it is always of a useful type
function calcWeight(term) {
    return Math.round(10 * Math.log10(40 - term.length) * 1.5)
***REMOVED***

module.exports = function *(next) {

    var data = this.request.body;
        data.created      = new Date();
        data.last_updated = new Date();

***REMOVED*** Adds element to elasticsearch
    var cui = data.cui || "CT" + new Date().getTime();
    var newDocument = {
        "index" : "autocomplete",
        "type"  : "records",

        "body"  : {
              "cui" : cui,
              "str" : data.str,
              "suggest" : {
                    "input": data.str,
                    "payload": { "cui": cui ***REMOVED***,
                    "weight" : calcWeight(data.str)
          ***REMOVED***,
              "source": "ctcue",
              "votes" : 20,
              "types" : data.types.split(",").map(function(s) { return s.trim(); ***REMOVED***)
    ***REMOVED***
***REMOVED***;

    var esResult = yield function(callback) {
        elasticClient.create(newDocument, function(err, response) {
            callback(err, response);
    ***REMOVED***);
***REMOVED***

    data._elasticId = esResult._id;

    this.body = yield table.insert(data);
***REMOVED***;
