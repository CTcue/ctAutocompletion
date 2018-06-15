"use strict";

var db    = require('../../lib/database');
var table = db.table('umls');

var _ = require("lodash");


module.exports = function *() {
    if (! _.has(this.params, "year") || !_.has(this.params, "month")) {
        return this.body = [];
    }

    // Damn date with zero indexes
    var start = new Date(this.params.year, this.params.month-1,  1);
    var end   = new Date(this.params.year, this.params.month-1, 31);

    this.body = yield table.find({ "created":
        {
            "$gte" : start,
            "$lt"  : end
        }
    });
}
