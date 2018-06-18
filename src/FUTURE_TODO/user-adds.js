
var config  = require("../config/config.js");
var _ = require("lodash");

var mongoDb = require("../lib/database");
var table   = mongoDb.table("umls");


module.exports = function* () {
    var params = this.request.body.query;

    // Store it in mongoDb for concept_manager
    var data = {
        "user"     : params.user,
        "synonym"  : params.synonym,
        "isCustom" : (params.hasOwnProperty("isCustom") && params.isCustom),
        "created"  : new Date()
    };

    var addedTerm = yield table.insert(data);

    this.body = !_.isEmpty(addedTerm);
};
