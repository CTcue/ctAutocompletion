"use strict";


/////
// Temp script
// - could be converted into something for admins


var db    = require('../../lib/database');
var table = db.table('umls');


var findUnused = {
    "$or": [
      { 'user._id': "57b5c839d0d42b53502a0d0e" ***REMOVED***,
      { 'user.name': "Admin powers" ***REMOVED***,
      { 'user.env' : "TEST_ENVIRONMENT" ***REMOVED***
    ]
***REMOVED***;

// find -- remove
var list = table.find(findUnused, function(err, list) {

    console.log(list)
    process.exit(0);

***REMOVED***);