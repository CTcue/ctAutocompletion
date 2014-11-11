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

var storage = {***REMOVED***;

/*
* Functions
*/

// Delete the current autocomplete index from ElasticSearch

function deleteIndex(index, callback) {
  reqClient.del(index, function (err, response, body) {
    if (body.error
      && body.error === 'IndexMissingException[[' + index + '] missing]') {
      console.log('\n ' + index + ' does not exist\n');
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

// Initialize a storage variable for the semantic types and their arrays

function insertSemanticTypes(semanticType, callback) {
  storage[semanticType] = {
    'name'  : semanticType,
  ***REMOVED***;
  callback();
***REMOVED***;

function initializeStorage(semanticTypes, callback) {
  async.each(semanticTypes, insertSemanticTypes, function (err) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      console.log(' Storage Initialized');
      callback(null, 'success');
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// MYSQL UMLS query for counting and retrieving atoms per semantic type

function umlsQuery(semanticType, count, callback) {
  var query = [
      "FROM MRSTY a, MRCONSO b",
      "WHERE a.STY = '" + semanticType + "'",
      "AND a.CUI = b.CUI"
    ];

    if (count === true) {
      query.unshift("SELECT COUNT(*)");
***REMOVED*** ***REMOVED***
      query.unshift("SELECT b.CUI, b.AUI, a.STY, b.STR");
***REMOVED***;

  callback(query.join(" "));
***REMOVED***;

// Initialize atomCountQuery per semantic type

function createAtomCountQuery(semanticType, callback) {
  umlsQuery(semanticType, true, function (query) {
    storage[semanticType].atomCountQuery = query;
    callback();
  ***REMOVED***);
***REMOVED***;

function initializeAtomCountQueries(semanticTypes, callback) {
  async.each(semanticTypes, createAtomCountQuery, function (err) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      console.log(' Atom Count Queries initialized');
      callback(null, 'success');
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Count the amount of atoms per semantic type in the MYSQL UMLS database
// and insert into storage variable

function retrieveAtomCount(semanticType, callback) {
    mysql.query(storage[semanticType].atomCountQuery, function (err, records) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      storage[semanticType].atomCount = records[0]['COUNT(*)'];
      callback();
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

function countAtoms(semanticTypes, callback) {
  console.log(' Counting atoms per semantic types... ');
  async.each(semanticTypes, retrieveAtomCount, function (err) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      console.log(' Done');
      callback(null, 'success');
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Initialize atomRetrieveQuery per semantic type

function createAtomRetrieveQuery(semanticType, callback) {
  umlsQuery(semanticType, false, function (query) {
    storage[semanticType].atomRetrieveQuery = query;
    callback();
  ***REMOVED***);
***REMOVED***;

function initializeAtomRetrieveQueries(semanticTypes, callback) {
  async.each(semanticTypes, createAtomRetrieveQuery, function (err) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      console.log(' Atom Retrieve Queries initialized\n');
      callback(null, 'success');
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Retrieve atoms per semantic type from the MYSQL UMLS database
// and insert into storage variable

function retrieveAtoms(semanticType, callback) {

  console.log('   Retrieving '
    + storage[semanticType].atomCount
    + ' atoms from semantic type '
    + semanticType + '...');

  mysql.query(storage[semanticType].atomRetrieveQuery, function (err, records) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      storage[semanticType].atoms = records;
      console.log('   Atoms retrieved: '
        + storage[semanticType].atoms.length
        + ' - Al atoms accounted for: '
        + (storage[semanticType].atomCount === storage[semanticType].atoms.length)
        + '\n');
      callback();
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

function storeAtoms(semanticTypes, callback) {

  console.log(' Retrieving atoms\n');

  async.eachSeries(semanticTypes, retrieveAtoms, function (err) {
    if (err) {
      callback(err);
***REMOVED*** ***REMOVED***
      console.log(' Atoms Retrieved and stored\n');
      callback(null, 'success');
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Transform stored atoms per semantic type into document format
// for ElasticSearch

function removeStopWords(word, callback) {

  var stopword = stopWords.english.concat(stopWords.dutch).indexOf(word)

  if (stopword === -1) {
    callback(true);
  ***REMOVED*** ***REMOVED***
    callback(false);
  ***REMOVED***;

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
          "output"  : atom.STR,
          "payload" : {
            "cui"           : atom.CUI,
            "aui"           : atom.AUI,
            "semanticType"  : atom.STY
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***;

  storage[atom.STY].transformedAtoms.push(document);

  setImmediate(callback);
***REMOVED***;

function transformAtoms(semanticTypeIndex, callback) {
  var semanticType = acConfig.semanticTypes[semanticTypeIndex]

  storage[semanticType].transformedAtoms = [];

  console.log('   Transforming '
  + storage[semanticType].atomCount
  + ' atoms from semantic type '
  + semanticType + '...');

  async.eachSeries(storage[semanticType].atoms, transformAtom, function (err) {
    if (err) {
      callback(err)
***REMOVED*** ***REMOVED***
      delete storage[semanticType].atoms;
      console.log('   Atoms transformed: '
      + storage[semanticType].transformedAtoms.length
      + ' - Al atoms accounted for: '
      + (storage[semanticType].atomCount === storage[semanticType].transformedAtoms.length)
      + '\n');
      callback();
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

function transformAllAtoms(semanticTypes, callback) {

  console.log(' Transforming atoms\n');

  async.timesSeries(semanticTypes.length, transformAtoms, function (err) {
    if (err) {
      callback(err)
***REMOVED*** ***REMOVED***
      console.log(' All atoms transformed to document format\n');
      callback(null, 'success');
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Upload the transformed atoms per semantic type to ElasticSearch

function uploadAtoms(semanticTypeIndex, callback) {
  var semanticType = acConfig.semanticTypes[semanticTypeIndex]

  console.log('   Uploading '
  + storage[semanticType].transformedAtoms.length
  + ' atoms from semantic type '
  + semanticType + '...');

  var uploadBar = new ProgressBar('   [:bar] :percent :etas', {
            complete: '*'
          , incomplete: '.'
          , width: 20
          , total: 100
  ***REMOVED***);

  var progressChunk = 100 / storage[semanticType].transformedAtoms.length;

  async.eachSeries(storage[semanticType].transformedAtoms
  , function uploadAtom(atom, callback) {

    elasticClient.index(atom, function (error, response) {
      uploadBar.tick(progressChunk);
      if (error) {
        console.error('elasticsearch cluster is down!');
        setImmediate(callback);
  ***REMOVED*** ***REMOVED***
        setImmediate(callback);
  ***REMOVED***;
***REMOVED***);

  ***REMOVED***, function (err) {
    if (err) {
      callback(err)
***REMOVED*** ***REMOVED***
      console.log('   Success\n');
      callback();
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

function uploadAllAtoms(semanticTypes, callback) {
  console.log(' Uploading atoms\n');

  async.timesSeries(semanticTypes.length, uploadAtoms, function (err) {
    if (err) {
      callback(err)
***REMOVED*** ***REMOVED***
      console.log(' All atoms uploaded to ElasticSearch\n');
      callback(null, 'success');
***REMOVED***;
  ***REMOVED***);
***REMOVED***;

// Close the MYSQL connection

function closeMYSQL(callback) {
  mysql.end();
  callback(null, 'success');
***REMOVED***;

// Close the ElasticSearch connection

function closeElasticSearch(callback) {
  elasticClient.close();
  callback(null, 'success');
***REMOVED***;

/*
* Execution
*/

async.series({

  deleteIndex : function (nextFunction) {
    deleteIndex(acConfig.index, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  mapIndex : function (nextFunction) {
    mapIndex(acConfig.index, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  initializeStorage : function (nextFunction) {
    initializeStorage(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  initializeAtomCountQueries : function (nextFunction) {
    initializeAtomCountQueries(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  countAtoms : function (nextFunction) {
    countAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  initializeAtomRetrieveQueries : function (nextFunction) {
    initializeAtomRetrieveQueries(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  storeAtoms : function (nextFunction) {
    storeAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  transformAllAtoms : function (nextFunction) {
    transformAllAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  uploadAllAtoms : function (nextFunction) {
    uploadAllAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***)
  ***REMOVED***,

  closeMYSQL : function (nextFunction) {
    closeMYSQL(function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  closeElasticSearch : function (nextFunction) {
    closeElasticSearch(function (err, success) {
      if (err) {
        nextFunction(err);
  ***REMOVED*** ***REMOVED***
        nextFunction(null, success);
  ***REMOVED***;
***REMOVED***);
  ***REMOVED***,

  Afsluiting : function (nextFunction) {
      nextFunction(null, 'success');
  ***REMOVED***

***REMOVED***, function (err, results) {
  if (err) {
    console.log(err);
  ***REMOVED*** ***REMOVED***
    console.log('\n\n Async results:\n', results, '\n');
  ***REMOVED***;
***REMOVED***);