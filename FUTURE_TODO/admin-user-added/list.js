"use strict";

var db    = require('../../lib/database');
var table = db.table('umls');


module.exports = function *() {

    //
    // Get most recent user added terms

    var recent = yield table.find({}, { "sort" : { "created": -1 }, "limit": 5 });


    //
    // Aggregate user added terms by month

    var aggregated = yield function(callback) {
        table.aggregate([
            {
                "$group" : {
                    "_id": {
                        "month": { "$month": "$created" },
                        "year":  { "$year": "$created" }
                    },
                    "count": { "$sum" : 1 }
                }
            }
        ],
        {},
        function(err, docs) {
            if (err) {
                callback(false, []);
            }
            else {
                var result = [];

                for (var i=0; i < docs.length; i++) {
                    result.push({
                        "year"   : docs[i]["_id"]["year"],
                        "month"  : docs[i]["_id"]["month"],
                        "date"   : new Date(docs[i]["_id"]["year"], +docs[i]["_id"]["month"] - 1),
                        "amount" : docs[i]["count"]
                    });
                }

                callback(false, result);
            }
        });
    }


    this.body = {
        "concepts": recent,
        "calendar_view": aggregated
    };
}