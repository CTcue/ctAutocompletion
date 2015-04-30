
var config = require('../config/config.js');

// Database
var db    = require('monk')(config.mongodb.path);
var wrap  = require('co-monk');
var table = wrap(db.get('customTerms'));

module.exports = function *() {
    this.body = yield table.find({});
};
