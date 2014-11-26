'use strict';

var config          = require('../config/config.js');
var mysql           = require('mysql').createConnection(config.mysql);

var semanticTypes   = require('./semanticTypes.js');

/*var countQuery = [
  "SELECT COUNT(b.CUI) as count",
  "FROM MRSTY a INNER JOIN MRCONSO b ON (a.CUI = b.CUI)",
  "WHERE a.STY IN ('"+ semanticTypes.join("', '") + "')"
].join(' ');
*/


//var countQuery = "SELECT COUNT(DISTINCT b.CUI) as count FROM MRSTY a INNER JOIN MRCONSO b ON (a.CUI = b.CUI) WHERE a.STY IN ('"+ semanticTypes.join("', '") + "') AND b.STT='PF' AND b.TTY IN ('AC', 'BD', 'CC', 'CDA', 'CDC ', 'CD', 'CMN ', 'CN', 'CPR ', 'CP', 'CR', 'CSY ', 'CV', 'CX', 'DE', 'DF', 'DI', 'DP', 'FI', 'FN', 'GN', 'ID', 'IN', 'IVC ', 'IV', 'LA', 'LC', 'LN', 'LPDN', 'LPN ', 'MD', 'MH', 'MIN ', 'MS', 'MTH_BD', 'MTH_CN', 'MTH_FN', 'MTH_ID', 'MTH_LN', 'MTH_OAP ', 'MTH_OPN ', 'MTH_OP', 'MTH_PTGB', 'MTH_PTN ', 'MTH_PT', 'MTH_RXN_BD', 'MTH_RXN_CDC ', 'MTH_RXN_CD', 'MTH_RXN_DP', 'MTH_RXN_RHT ', 'MTH_SI', 'MTH_SMQ ', 'MV', 'NA', 'NM', 'OCD ', 'OC', 'OPN ', 'OP', 'OR', 'OSN ', 'PCE ', 'PC', 'PEN ', 'PEP ', 'PN', 'PR', 'PSC ', 'PSN ', 'PTAV', 'PTCS', 'PTGB', 'PTJKN1', 'PTJKN ', 'PTN ', 'PT', 'PX', 'RPT ', 'RXN_IN', 'RXN_PT', 'SBDC', 'SBDF', 'SBDG', 'SBD ', 'SCDC', 'SCDF', 'SCDG', 'SCD ', 'SCN ', 'SD', 'SI', 'SMQ ', 'SP', 'ST', 'SU', 'TA', 'TG', 'UCN ', 'USN ', 'VPT ', 'VS', 'XD')";

var countQuery = [
  "SELECT COUNT(CUI) as count",
  "FROM MRSTY WHERE STY IN ('"+ semanticTypes.join("', '") + "')"
].join(" ")

/*
var countQuery = [
  "SELECT COUNT(a.CUI) as count",
  "FROM MRSTY a INNER JOIN MRREL b ON (a.CUI=b.CUI2)",
  "WHERE a.STY IN ('"+ semanticTypes.join("', '") + "')",
  "AND b.RELA IS NULL"
].join(" ");*/

mysql.query(countQuery, function(err, data) {
  if (err) {
    console.log("ERROR: " + err)
  }
  else {
    console.log(data[0]["count"]);
  }

  process.exit(0);
});
