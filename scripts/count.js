'use strict';

var config = require('../config/config.js');
var mysql  = require('mysql').createConnection(config.mysql);

// Get largest CUI code
var countQuery = "SELECT CUI FROM MRCONSO ORDER BY CUI DESC LIMIT 1"

mysql.query(countQuery, function(err, data) {
  if (err) {
    console.log("ERROR: " + err)
  }
  else {
    console.log(data[0].CUI.substring(1));
  }

  process.exit(0);
});