"use strict";

var db    = require('../../lib/database');
var table = db.table('umls');


module.exports = function *() {

    // Find all terms/synonyms added more than once
    this.body =  yield function(callback) {
        table.aggregate([
            {
                "$group" : {
                    "_id": {
                        "synonym": "$synonym.term"
                    },

                    "set" : { "$addToSet" : "$synonym.cui" },

                    "count": { "$sum" : 1 }
                }
            },
            {
                "$match": {
                    "_id": { "$ne" : null } ,
                    "count": { "$gt": 1 }
                }
            }
        ], {},
        function(err, docs) {
            if (err) {
                callback(false, []);
            }
            else {
                callback(false, docs.map(function(item) {
                    var tmp = {};
                        tmp["set"]     = item["set"]
                        tmp["synonym"] = item["_id"]["synonym"];
                        tmp["amount"]  = item["count"];

                    return tmp;
                }));
            }
        });
    };
}