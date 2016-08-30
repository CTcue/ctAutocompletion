"use strict";

var db    = require('../../lib/database');
var table = db.table('umls');


var findUnused = {
    "$or": [
      { 'user.name': "Admin powers" ***REMOVED***,
      { 'user.name': "Normal user" ***REMOVED***,
      { 'user.env' : "TEST_ENVIRONMENT" ***REMOVED***
    ]
***REMOVED***;

var list = table.find(findUnused, function(err, list) {

    console.log(list)

    process.exit(0);
***REMOVED***);