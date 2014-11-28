#!/usr/bin/env node
'use strict';

var config  = require('../config/config.js');

var wrapper = require('co-mysql'),
    mysql   = require('mysql'),
    co      = require('co');

var connection = mysql.createConnection(config.mysql);
    connection.connect();

var client = wrapper(connection);

//var mysql   = require('mysql').createConnection(config.mysql);

var elastic = require('elasticsearch');
var sugar   = require('sugar');
var _       = require('lodash');

var elasticClient = new elastic.Client({
  "apiVersion" : "1.3",

  "log" : [
    {
      type  : 'file',
      level : 'trace',
      path  : './elastic_trace.log'
***REMOVED***,
    {
      type  : 'file',
      level : 'error',
      path  : './elastic_error.log'
***REMOVED***
  ]
***REMOVED***);

//var stopWords     = require('./stopwords.json');
var semanticTypes = require('./semanticTypes.js');
var limit  = [ process.argv[2], process.argv[3] ];

var cuiQuery = [
  "SELECT DISTINCT CUI, STY",
  "FROM MRSTY",
  "WHERE STY IN ('"+ semanticTypes.join("', '") + "')",
  "LIMIT " + limit.join(", ")
].join(" ");


co(function *() {
  var bulk = [];
  var cuiCodes = yield client.query(cuiQuery);

  if (! cuiCodes) {
    console.log("Could not get CUI codes!");
    process.exit(0);    
  ***REMOVED***
  
  // Get all records for single CUI
  for (var i in cuiCodes) {

***REMOVED*** Possibly narrow it down for preffered terms
***REMOVED*** Then include keywords/key-phrases as well 
    var retrieveQuery = [
      "SELECT STR",
      "FROM MRCONSO",
      "WHERE CUI='" + cuiCodes[i].CUI + "'",
      "AND TS='P'",
      "AND STT='PF'",
      "AND ISPREF='Y'"
    ].join(" ");

    var records = yield client.query(retrieveQuery);

    if (records) {
      bulk.push({ 
        "index" : {
          "_index" : "autocomplete",
          "_type"  : cuiCodes[i].STY.toLowerCase().replace(/ /g, "_"),
    ***REMOVED***
  ***REMOVED***);

      var output;    
      output = _.pluck(records, 'STR');
      output = _.map(output, function(str) {
        return str.toLowerCase()
              ***REMOVED***.replace("disease/diagnosis", "")
              ***REMOVED***.replace("disease/disorder", "")
              ***REMOVED***.replace("disease/finding", "")
              ***REMOVED***.replace(/\W+/g, " ")
                  .replace(/[,.'";:]/g, " ")
                  .replace(/  /g, " ")
                  .trim();
  ***REMOVED***);

      output = _.uniq(output);

  ***REMOVED*** Get avg. length 
      var sum = _.reduce(output, function(sum, str) {
        return sum + str.length;
  ***REMOVED***, 0);

      var average = Math.ceil(sum / output.length);
          average = average > 20 ? average + 10 : average;

      bulk.push({
        "complete" : {
          "weight"  : Math.ceil(1000 / average),
          "input"   : output,
          "output"  : output,
          "payload" : { "cui" : cuiCodes[i].CUI, "codes" : output ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
***REMOVED***
  ***REMOVED***

  connection.end();

  // Insert records in Elasticsearch
  elasticClient.bulk({'body' : bulk ***REMOVED***, function(err, body) {
    var offset = parseInt(process.argv[2], 10);
    var end    = offset + parseInt(process.argv[3], 10);

    console.log("Inserted " + offset + "," + end);
    process.exit(0);
  ***REMOVED***);
***REMOVED***);