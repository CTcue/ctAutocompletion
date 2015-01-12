'use strict';

var config  = require('../config/config.js');
var mysql   = require('mysql').createConnection(config.mysql);
var queries = require('./queries/main.js');

console.log(30);

/*
mysql.query(queries.countQuery, function(err, data) {
  if (err) {
    console.log("ERROR: " + err)
  ***REMOVED***
  ***REMOVED***
    console.log(data[0]["count"]);
  ***REMOVED***

  process.exit(0);
***REMOVED***);
*/

process.exit(0);
