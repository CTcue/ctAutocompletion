"use strict";

var db    = require('../../lib/database');
var table = db.table('umls');


module.exports = function *() {

***REMOVED*** Find all terms/synonyms added more than once
    this.body =  yield function(callback) {
        table.col.aggregate([
            {
                "$group" : {
                    "_id": {
                        "synonym": "$synonym.term"
                ***REMOVED***,

                    "set" : { "$addToSet" : "$synonym.cui" ***REMOVED***,

                    "count": { "$sum" : 1 ***REMOVED***
            ***REMOVED***
        ***REMOVED***,
            {
                "$match": {
                    "_id": { "$ne" : null ***REMOVED*** ,
                    "count": { "$gt": 1 ***REMOVED***
            ***REMOVED***
        ***REMOVED***
        ], {***REMOVED***,
        function(err, docs) {
            if (err) {
                callback(false, []);
        ***REMOVED***
            ***REMOVED***
                callback(false, docs.map(function(item) {
                    var tmp = {***REMOVED***;
                        tmp["set"]     = item["set"]
                        tmp["synonym"] = item["_id"]["synonym"];
                        tmp["amount"]  = item["count"];

                    return tmp;
            ***REMOVED***));
        ***REMOVED***
    ***REMOVED***);
***REMOVED***;
***REMOVED***