'use strict';

/*
* Module dependencies
*/

var config        = require('../config/config.js');
var acConfig      = require('./autoCompleteConfig.json');
var reqClient     = require('request-json').newClient(config.elastic);
var async         = require('async');
var stopWords     = require('./stopwords.json');

/*
* Global Variables
*/

var mapping = {
  "settings"  : acConfig.indexSettings,
  "mappings"  : {}
};

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
    } else if (body.error
      && body.error !== 'IndexMissingException[[' + index + '] missing]') {
      callback(body, null);
    } else if (body.acknowledged
      && body.acknowledged === true) {
      console.log('\n Index ' + index + ' deleted');
      callback(null, 'success');
    } else {
      callback({ 'err' : body }, null);
    };
  });
};

// Create the mappings and settings for the new autocomplete index and insert
// into ElasticSearch

function createSemanticMappings(semanticType, callback) {
  mapping.mappings[
    semanticType.toLowerCase().replace(/\s/g, '_')
  ] = acConfig.typeMapping;
  callback();
};

function mapIndex(index, callback) {
  async.each(acConfig.semanticTypes, createSemanticMappings
  , function (err) {
    if (err) {
      callback(err);
    } else {
      reqClient.put(index, mapping, function (err, response, body) {
        console.log(' Index ' + index + ' mapped');
        callback(null, 'success');
      });
    };
  });
};

/*
* Execution
*/

async.series({

  deleteAndMapIndex : function (nextFunction) {
    deleteIndex(acConfig.index, function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        mapIndex(acConfig.index, function (err, success) {
          if (err) {
            nextFunction(err);
          } else {
            nextFunction(null, success);
          };
        });
      };
    });
  },

}, function (err, results) {
  if (err) {
    console.log(err);
  } else {
    console.log('\n\n Async results:\n', results, '\n');
  };
});