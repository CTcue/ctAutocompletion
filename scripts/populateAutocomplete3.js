'use strict';

/*
* Module dependencies
*/

var config          = require('../config/config.js');
var mysql           = require('mysql').createConnection(config.mysql);
var reqClient       = require('request-json').newClient(config.elastic);
var elastic         = require('elasticsearch');
var async           = require('async');
var utf8            = require('utf8');
var ascii           = require('diacritics').remove;
var _               = require('underscore');
var ProgressBar     = require('progress');

var acConfig        = require('./autoCompleteConfig.json');
var stopWords       = require('./stopwords.json');

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

var elasticClient = new elastic.Client(elasticOptions);

/*
* Global Variables
*/

var mapping = {
  "settings"  : acConfig.indexSettings,
  "mappings"  : {}
};

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

var uploadBar = new ProgressBar(' [:bar] :percent :etas Uploading documents', {
          complete: '*'
        , incomplete: '.'
        , width: 50
        , total: 100
});

var uploadChunk = 0;

/*
* Functions
*/

// Delete the current autocomplete index from ElasticSearch

function deleteIndex(index, callback) {
  reqClient.del(index, function (err, response, body) {
    if (err && err.code === "ECONNREFUSED") {
        console.log("Please start elasticsearch!");
        process.exit(1);
    } else if (body.error
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

// Count atoms in MYSQL UMLS database

function countAtoms(callback) {
  mysql.query(umlsCountQuery, function (err, counts) {
    if (err) {
      callback(err);
    } else {
      console.log(' Atom Count: ' + counts[0]['COUNT(*)']);
      callback(null, counts[0]['COUNT(*)']);
    };
  });
};

// Retrieve atoms from MYSQL UMLS database

function retrieveAtoms(atomCount, callback) {
  console.log(' Retrieving all atoms. This can take up to 5 minutes...\n');
  mysql.query(umlsRetrieveQuery, function (err, records) {
    if (err) {
      callback(err);
    } else {
      uploadChunk     = 100 / records.length;
      console.log(' Atoms retrieved: ' + records.length);
      console.log(' All atoms accounted for: '
                  + (atomCount === records.length)
                  + '\n');
      console.log(' Uploading all atoms');
      callback(null, records);
    };
  });
};

// Transform MYSQL atoms into JSON atoms

function removeStopWords(word, callback) {

  var stopword = stopWords.english.concat(stopWords.dutch).indexOf(word)

  if (stopword === -1) {
    callback(true);
  } else {
    callback(false);
  };

};

function uploadDocument(document, callback) {

  elasticClient.index(document, function (error, response) {
    uploadBar.tick(uploadChunk);
    if (error) {
      console.error(error);
      callback();
    } else {
      callback();
    };
  });

};

function transformAtom(atom, callback) {

  async.filterSeries(atom.STR.split(' '), removeStopWords, function (results) {
    atom.input = results;
  });

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
        }
      }
    }
  };

  document.body.atom.input.push(atom.STR.toLowerCase()
             .replace(/'/g, "")
             .replace(/\W+/g, " ")
             .replace(/\s+/g, " ")
             .trim());

  uploadDocument(document, function () {
    callback();
  });
};

// Execute count, retrieve, transform and upload atoms

function retrieveTransformUploadAtoms(semanticTypes, callback) {
  countAtoms(function (err, atomCount) {
    if (err) {
      callback(err);
    } else {

      retrieveAtoms(atomCount, function (err, records) {
        if (err) {
          callback(err);
        } else {

          async.eachSeries(records, transformAtom, function (err) {
            if (err) {
              callback(err);
            } else {

              callback();

            };
          });
        };
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

  retrieveTransformUploadAtoms : function (nextFunction) {
    retrieveTransformUploadAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, 'success');
      };
    });
  },

  endMYSQL : function (nextFunction) {
    mysql.end();
    nextFunction(null, 'success');
  },

  endElastic : function (nextFunction) {
    elasticClient.close();
    nextFunction(null, 'success');
  }

}, function (err, results) {
  if (err) {
    console.log(err);
  } else {
    console.log('\n\n Async results:\n', results, '\n');
  };
});