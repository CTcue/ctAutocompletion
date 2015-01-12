'use strict';

var config  = require('../config/config.js');
var mysql   = require('mysql').createConnection(config.mysql);
var queries = require('./queries/main.js');

console.log(30);

/*
mysql.query(queries.countQuery, function(err, data) {
  if (err) {
    console.log("ERROR: " + err)
  }
  else {
    console.log(data[0]["count"]);
  }

  process.exit(0);
});
*/

process.exit(0);
