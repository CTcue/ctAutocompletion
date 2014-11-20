'use strict';

/*
* Module dependencies
*/

var config        = require('../config/config.js');
var mysql         = require('mysql').createConnection(config.mysql);
var reqClient     = require('request-json').newClient(config.elastic);
var elastic       = require('elasticsearch');
var async         = require('async');
var ProgressBar   = require('progress');

var acConfig      = require('./autoCompleteConfig.json');
var stopWords     = require('./stopwords.json');

var elasticOptions = {
  host  : 'localhost:9200',
  log   : [
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
***REMOVED***;

var elasticClient = new elastic.Client(elasticOptions);

/*
* Global Variables
*/

var mapping = {
  "settings"  : acConfig.indexSettings,
  "mappings"  : {***REMOVED***
***REMOVED***;

var umlsCountQuery = [
  "SELECT COUNT(*)",
  "FROM MRSTY a, MRCONSO b",
  "WHERE a.STY IN ('"
  + acConfig.semanticTypes.join("', '") + "')",
  "AND a.CUI = b.CUI"
].join(' ');

var umlsRetrieveQuery = [
  "SELECT b.CUI, b.AUI, a.STY, b.STR",
  "FROM MRSTY a, MRCONSO b",
  "WHERE a.STY IN ('"
  + acConfig.semanticTypes.join("', '") + "')",
  "AND a.CUI = b.CUI"
].join(' ');

var transformBar = new ProgressBar(' [:bar] :percent :etas Transforming atoms to documents', {
          complete: '*'
        , incomplete: '.'
        , width: 50
        , total: 100
***REMOVED***);

var transformChunk = 0;

var uploadBar = new ProgressBar(' [:bar] :percent :etas Uploading documents', {
          complete: '*'
        , incomplete: '.'
        , width: 50
        , total: 100
***REMOVED***);

var uploadChunk = 0;

/*
* Functions
*/

// Delete the current autocomplete index from ElasticSearch

function deleteIndex(index, callback) {
  reqClient.del(index, function (err, response, body) {
    if (body.error
      && body.error === 'IndexMissingException[[' + index + '] missing]') {
      console.log('\n Index\'' + index + '\' does not exist');
      callback(null, 'success');
***REMOVED*** else if (body.error
      && body.error !== 'IndexMissingException[[' + index + '] missing]') {
      callback(body, null);
***REMOVED*** else if (body.acknowledged
      && body.acknowledged === true) {
      console.log('\n Index ' + index + ' deleted');
      callback(null, 'success');
***REMOVED*** ***REMOVED***
      callback({ 'err' : body ***REMOVED***, null);
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Create the mappings and settings for the new autocomplete index and insert
// into ElasticSearch

function createSemanticMappings(semanticType, callback) {
  mapping.mappings[
    semanticType.toLowerCase().replace(/\s/g, '_')
  ] = acConfig.typeMapping;
  callback();
***REMOVED***;

function mapIndex(index, callback) {
  async.each(acConfig.semanticTypes, createSemanticMappings
  , function (err) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      reqClient.put(index, mapping, function (err, response, body) {
        console.log(' Index ' + index + ' mapped');
        callback(null, 'success');
  ***REMOVED***);
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Count atoms in MYSQL UMLS database

function countAtoms(callback) {
  mysql.query(umlsCountQuery, function (err, counts) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      console.log(' Atom Count: ' + counts[0]['COUNT(*)']);
      callback(null, counts[0]['COUNT(*)']);
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Retrieve atoms from MYSQL UMLS database

function retrieveAtoms(atomCount, callback) {
  console.log(' Retrieving all atoms. This can take up to 5 minutes...\n');
  mysql.query(umlsRetrieveQuery, function (err, records) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      transformChunk  = 100 / records.length;
      uploadChunk     = 100 / records.length;
      console.log(' Atoms retrieved: ' + records.length);
      console.log(' All atoms accounted for: '
                  + (atomCount === records.length)
                  + '\n');
      console.log(' Uploading all atoms');
      callback(null, records);
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Transform MYSQL atoms into JSON atoms

function removeStopWords(word, callback) {

  var stopword = stopWords.english.concat(stopWords.dutch).indexOf(word)

  if (stopword === -1) {
    callback(true);
  ***REMOVED*** ***REMOVED***
    callback(false);
  ***REMOVED***;

***REMOVED***;

function uploadDocument(document, callback) {

  elasticClient.index(document, function (error, response) {
    uploadBar.tick(uploadChunk);
    if (error) {
      console.error(error);
      setImmediate(callback);
***REMOVED*** ***REMOVED***
      setImmediate(callback);
***REMOVED***;
  ***REMOVED***);

***REMOVED***;

function transformAtom(atom, callback) {

  async.filterSeries(atom.STR.split(' '), removeStopWords, function (results) {
    atom.input = results;
  ***REMOVED***);

  var document = {
    "index" : acConfig.index,
    "type"  : atom.STY.toLowerCase().replace(/\s/g, '_'),
    "body"  : {
      "atom"  : {
        "input"   : atom.input,
        "output"  : atom.STR.toLowerCase()
             .replace(/'/g, "")
             .replace(/\W+/g, " ")
             .replace(/\s+/g, " ")
             .trim(),
        "payload" : {
          "cui"           : atom.CUI,
          "aui"           : atom.AUI,
          "semanticType"  : atom.STY
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  document.body.atom.input.push(atom.STR.toLowerCase()
             .replace(/'/g, "")
             .replace(/\W+/g, " ")
             .replace(/\s+/g, " ")
             .trim());

  // transformBar.tick(transformChunk);

  uploadDocument(document, function () {
    callback();
  ***REMOVED***);
***REMOVED***;

// Execute count, retrieve, transform and upload atoms

function retrieveTransformUploadAtoms(semanticTypes, callback) {
  countAtoms(function (err, atomCount) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***

      retrieveAtoms(atomCount, function (err, records) {
        if (err) {
          callback(err);
    ***REMOVED*** ***REMOVED***

          async.eachSeries(records, transformAtom, function (err) {
            if (err) {
              callback(err);
        ***REMOVED*** ***REMOVED***

              callback();

        ***REMOVED***;
      ***REMOVED***);

    ***REMOVED***;
  ***REMOVED***);
***REMOVED***;
  ***REMOVED***);
***REMOVED***;


/*
* Execution
*/

async.series({

  deleteAndMapIndex : function (nextFunction) {
    deleteIndex(acConfig.index, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        mapIndex(acConfig.index, function (err, success) {
          if (err) {
            nextFunction(err);
      ***REMOVED*** ***REMOVED***
            nextFunction(null, success);
      ***REMOVED***;
    ***REMOVED***);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  retrieveTransformUploadAtoms : function (nextFunction) {
    retrieveTransformUploadAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, 'success');
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  endMYSQL : function (nextFunction) {
    mysql.end();
    nextFunction(null, 'success');
  ***REMOVED***,

  endElastic : function (nextFunction) {
    elasticClient.close();
    nextFunction(null, 'success');
  ***REMOVED***

***REMOVED***, function (err, results) {
  if (err) {
    console.log(err);
  ***REMOVED*** ***REMOVED***
    console.log('\n\n Async results:\n', results, '\n');
  ***REMOVED***;
***REMOVED***);