'use strict';

var db    = require('../../lib/database');
var table = db.table('umls');


module.exports = function *(next) {
    var data  = this.request.body;
        data.last_updated = new Date();

***REMOVED*** Do the update and add revision history
    var updateObject = {
        "$set" : data
***REMOVED***;

    this.body = yield table.update({ "_id" : this.params.id ***REMOVED***, updateObject);
***REMOVED***;