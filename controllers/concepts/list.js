"use strict";

var db    = require('../../lib/database');
var table = db.table('umls');


module.exports = function *() {
    this.body = yield table.find({});
}