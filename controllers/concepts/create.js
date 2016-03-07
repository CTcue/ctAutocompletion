'use strict';

var db    = require('../../lib/database');
var table = db.table('umls');

var elastic = require('elasticsearch');
var elasticClient = new elastic.Client();


// Same as upload weight function
// Except it assumes it is always of a useful type
function calcWeight(term) {
    return Math.round(10 * Math.log10(40 - term.length) * 1.5)
}

module.exports = function *(next) {

    var data = this.request.body;
        data.created      = new Date();
        data.last_updated = new Date();

    // Adds element to elasticsearch
    var cui = data.cui || "CT" + new Date().getTime();
    var newDocument = {
        "index" : "autocomplete",
        "type"  : "records",

        "body"  : {
              "cui" : cui,
              "str" : data.str,
              "suggest" : {
                    "input": data.str,
                    "payload": { "cui": cui },
                    "weight" : calcWeight(data.str)
              },
              "source": "ctcue",
              "votes" : 20,
              "types" : data.types.split(",").map(function(s) { return s.trim(); })
        }
    };

    var esResult = yield function(callback) {
        elasticClient.create(newDocument, function(err, response) {
            callback(err, response);
        });
    }

    data._elasticId = esResult._id;

    this.body = yield table.insert(data);
};
