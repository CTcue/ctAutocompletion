"use strict";


/////
// Temp script
// - could be converted into something for admins


var db    = require('../../lib/database');
var table = db.table('umls');


var findUnused = {
    "$or": [
      { 'user._id': "57b5c839d0d42b53502a0d0e" },
      { 'user.name': "Admin powers" },
      { 'user.env' : "TEST_ENVIRONMENT" }
    ]
};

// find -- remove
var list = table.find(findUnused, function(err, list) {
    process.exit(0);
});