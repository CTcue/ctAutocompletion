"use strict";

var db    = require('../../lib/database');
var table = db.table('umls');


module.exports = function *() {

    var recent = yield table.find({***REMOVED***, { "sort" : { "created": -1 ***REMOVED***, "limit": 5 ***REMOVED***);

    var aggregated = yield function(callback) {
        table.col.aggregate([{
            "$group" : {
                "_id": {
                    month: { $month: "$created" ***REMOVED***,
                    year: { $year: "$created" ***REMOVED***
            ***REMOVED***,
                "count": { $sum : 1 ***REMOVED***
        ***REMOVED***
    ***REMOVED***], {***REMOVED***,
        function(err, docs) {
            if (err) {
                callback(false, []);
        ***REMOVED***
            ***REMOVED***
                var result = [];

                for (var i=0; i < docs.length; i++) {
                    result.push({
                        "year": docs[i]["_id"]["year"],
                        "month": docs[i]["_id"]["month"],
                        "date": new Date(docs[i]["_id"]["year"], +docs[i]["_id"]["month"] - 1),
                        "amount": docs[i]["count"]
                ***REMOVED***);
            ***REMOVED***

                callback(false, result);
        ***REMOVED***
    ***REMOVED***);
***REMOVED***


    this.body = {
        "concepts": recent,
        "calendar_view": aggregated
***REMOVED***;
***REMOVED***