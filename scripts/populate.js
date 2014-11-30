#!/usr/bin/env node
'use strict';

var config  = require('../config/config.js');

var wrapper = require('co-mysql'),
    mysql   = require('mysql'),
    co      = require('co');

var connection = mysql.createConnection(config.mysql);
    connection.connect();

var client = wrapper(connection);

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

var stopWords     = require('./stopwords.json');
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
  for (var i=0, L=cuiCodes.length; i<L; i++) {
***REMOVED*** Possibly narrow it down for preffered terms
***REMOVED*** Then include keywords/key-phrases as well 
    var retrieveQuery = [
      "SELECT STR",
      "FROM MRCONSO",
      "WHERE CUI='" + cuiCodes[i].CUI + "'",
      "AND TS='P'",
      "AND STT='PF'",
      "AND ISPREF='Y'",
      "AND LAT in ('ENG', 'DUT')"
    ].join(" ");

    var records = yield client.query(retrieveQuery);

    if (records) {
      bulk.push({ 
        "index" : {
          "_index" : "autocomplete",
          "_type"  : cuiCodes[i].STY.toLowerCase().replace(/ /g, "_"),
    ***REMOVED***
  ***REMOVED***);

      var definitions;
      definitions = _.pluck(records, 'STR');
      definitions = _.map(definitions, function(str) {
        return str.toLowerCase()
                  .replace(/[,.'";:_-]/g, " ")
                  .replace(/  /g, " ")
                  .trim();
  ***REMOVED***);

      definitions = _.uniq(definitions);

  ***REMOVED*** Get unique words for suggestions / autocompletion of multiple words
  ***REMOVED*** so that the order does not matter
      var words = _.map(definitions, function(str) {
        return _.reject(str.words(), function(str) {
            return stopWords.indexOf(str) >= 0;
      ***REMOVED***);
  ***REMOVED***);

      words = _.uniq(_.flatten(words, true));
    
  ***REMOVED*** The less unique words -> higher score
  ***REMOVED*** TODO : check if additional penalty for very long defenitions is needed
      var score = Math.ceil(100 / words.length);

      bulk.push({
        "complete" : {
          "weight"  : score,
          "input"   : definitions,
          "output"  : definitions,
          "payload" : { "cui" : cuiCodes[i].CUI, "codes" : definitions ***REMOVED***
    ***REMOVED***,

        "words" : {
          "weight"  : score,
          "input"   : words,
          "output"  : words,
          "payload" : { "cui" : cuiCodes[i].CUI, "codes" : definitions ***REMOVED***
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
