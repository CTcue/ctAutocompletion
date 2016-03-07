'use strict';

var db    = require('../../lib/database');
var table = db.table('umls');


module.exports = function *() {
    var item = yield table.findOne({ "_id": this.params.id });

    if (item) {
        // var esDocument = {
        //     "index" : "autocomplete",
        //     "type"  : "records",
        //     "id"    : item._elasticId
        // };

        // var esResult = yield function(callback) {
        //     elasticClient.delete(esDocument, function(err, response) {
        //         callback(err, response);
        //     });
        // }

        this.body = yield table.remove({ "_id": this.params.id });
    }

    this.body = false;
};