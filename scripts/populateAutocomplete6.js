// 'use strict';

/*
* Module dependencies
*/

var config          = require('../config/config.js');
var mysql           = require('mysql').createConnection(config.mysql);
var _               = require('lodash');
var stopWords       = require('./stopwords.json');

var elastic         = require('elasticsearch');
var elasticOptions  = {
  host  : 'localhost:9200',
  log   : [
    {
      type  : 'file',
      level : 'trace',
      path  : './elastic_trace.log'
    },
    {
      type  : 'file',
      level : 'error',
      path  : './elastic_error.log'
    }
  ]
};
var elasticClient   = new elastic.Client(elasticOptions);

/*
* Global Variables
*/

var totalUploaded = 0;
var totalRecords  = 0;
var limit         = [0, 100]

var semanticTypes = [
    // "Sign or Symptom"
  // , "Pathologic Function"
  // , "Disease or Syndrome"
  // , "Mental or Behavioral Dysfunction"
  // , "Neoplastic Process"
  // , "Cell or Molecular Dysfunction"
  , "Experimental Model of Disease"
  // , "Injury or Poisoning"
  // , "Clinical Drug"
  ];

var retrieveQuery = [
  "SELECT b.CUI, b.AUI, a.STY, b.STR",
  "FROM MRSTY a, MRCONSO b",
  "WHERE a.STY IN ('"+ semanticTypes.join("', '") + "')",
  "AND a.CUI = b.CUI LIMIT " + limit.join(", ")
].join(' ');

var countQuery = [
  "SELECT COUNT(*)",
  "FROM MRSTY a, MRCONSO b",
  "WHERE a.STY IN ('"+ semanticTypes.join("', '") + "')",
  "AND a.CUI = b.CUI"
].join(' ');

/*
* Functions
*/