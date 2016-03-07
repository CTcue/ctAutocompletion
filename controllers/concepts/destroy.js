'use strict';

var db    = require('../../lib/database');
var table = db.table('umls');


module.exports = function *() {
    var item = yield table.findOne({ "_id": this.params.id ***REMOVED***);

    if (item) {
    ***REMOVED*** var esDocument = {
    ***REMOVED***     "index" : "autocomplete",
    ***REMOVED***     "type"  : "records",
    ***REMOVED***     "id"    : item._elasticId
    ***REMOVED*** ***REMOVED***;

    ***REMOVED*** var esResult = yield function(callback) {
    ***REMOVED***     elasticClient.delete(esDocument, function(err, response) {
    ***REMOVED***         callback(err, response);
    ***REMOVED*** ***REMOVED***);
    ***REMOVED*** ***REMOVED***

        this.body = yield table.remove({ "_id": this.params.id ***REMOVED***);
***REMOVED***

    this.body = false;
***REMOVED***;