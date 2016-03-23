'use strict';

var list   = require('./list');

// Check for admin token
var verify = require("../verify");


module.exports = function(app) {
    // For now, only allow listing
    // Get list of possible diagnosis codes based on specialty_code
    app['get'] (
      '/dbc/:specialty_code',
      verify,
      list
    );
};
