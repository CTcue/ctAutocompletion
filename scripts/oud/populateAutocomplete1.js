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

var storage = {};

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

// Initialize a storage variable for the semantic types and their arrays

function insertSemanticTypes(semanticType, callback) {
  storage[semanticType] = {
    'name'  : semanticType,
  };
  callback();
};

function initializeStorage(semanticTypes, callback) {
  async.each(semanticTypes, insertSemanticTypes, function (err) {
    if (err) {
      callback(err);
    } else {
      console.log(' Storage Initialized');
      callback(null, 'success');
    };
  });
};

// MYSQL UMLS query for counting and retrieving atoms per semantic type

function umlsQuery(semanticType, count, callback) {
  var query = [
      "FROM MRSTY a, MRCONSO b",
      "WHERE a.STY = '" + semanticType + "'",
      "AND a.CUI = b.CUI"
    ];

    if (count === true) {
      query.unshift("SELECT COUNT(*)");
    } else {
      query.unshift("SELECT b.CUI, b.AUI, a.STY, b.STR");
    };

  callback(query.join(" "));
};

// Initialize atomCountQuery per semantic type

function createAtomCountQuery(semanticType, callback) {
  umlsQuery(semanticType, true, function (query) {
    storage[semanticType].atomCountQuery = query;
    callback();
  });
};

function initializeAtomCountQueries(semanticTypes, callback) {
  async.each(semanticTypes, createAtomCountQuery, function (err) {
    if (err) {
      callback(err);
    } else {
      console.log(' Atom Count Queries initialized');
      callback(null, 'success');
    };
  });
};

// Count the amount of atoms per semantic type in the MYSQL UMLS database
// and insert into storage variable

function retrieveAtomCount(semanticType, callback) {
    mysql.query(storage[semanticType].atomCountQuery, function (err, records) {
    if (err) {
      callback(err);
    } else {
      storage[semanticType].atomCount = records[0]['COUNT(*)'];
      callback();
    };
  });
};

function countAtoms(semanticTypes, callback) {
  console.log(' Counting atoms per semantic types... ');
  async.each(semanticTypes, retrieveAtomCount, function (err) {
    if (err) {
      callback(err);
    } else {
      console.log(' Done');
      callback(null, 'success');
    };
  });
};

// Initialize atomRetrieveQuery per semantic type

function createAtomRetrieveQuery(semanticType, callback) {
  umlsQuery(semanticType, false, function (query) {
    storage[semanticType].atomRetrieveQuery = query;
    callback();
  });
};

function initializeAtomRetrieveQueries(semanticTypes, callback) {
  async.each(semanticTypes, createAtomRetrieveQuery, function (err) {
    if (err) {
      callback(err);
    } else {
      console.log(' Atom Retrieve Queries initialized\n');
      callback(null, 'success');
    };
  });
};

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
    } else {
      storage[semanticType].atoms = records;
      console.log('   Atoms retrieved: '
        + storage[semanticType].atoms.length
        + ' - Al atoms accounted for: '
        + (storage[semanticType].atomCount === storage[semanticType].atoms.length)
        + '\n');
      callback();
    };
  });
};

function storeAtoms(semanticTypes, callback) {

  console.log(' Retrieving atoms\n');

  async.eachSeries(semanticTypes, retrieveAtoms, function (err) {
    if (err) {
      callback(err);
    } else {
      console.log(' Atoms Retrieved and stored\n');
      callback(null, 'success');
    };
  });
};

// Transform stored atoms per semantic type into document format
// for ElasticSearch

function removeStopWords(word, callback) {

  var stopword = stopWords.english.concat(stopWords.dutch).indexOf(word)

  if (stopword === -1) {
    callback(true);
  } else {
    callback(false);
  };

};

function transformAtom(atom, callback) {

  async.filterSeries(atom.STR.split(' '), removeStopWords, function (results) {
    atom.input = results;
  });

  atom.input.push(atom.STR);

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
          }
        }
      }
    };

  storage[atom.STY].transformedAtoms.push(document);

  setImmediate(callback);
};

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
    } else {
      delete storage[semanticType].atoms;
      console.log('   Atoms transformed: '
      + storage[semanticType].transformedAtoms.length
      + ' - Al atoms accounted for: '
      + (storage[semanticType].atomCount === storage[semanticType].transformedAtoms.length)
      + '\n');
      callback();
    };
  });
};

function transformAllAtoms(semanticTypes, callback) {

  console.log(' Transforming atoms\n');

  async.timesSeries(semanticTypes.length, transformAtoms, function (err) {
    if (err) {
      callback(err)
    } else {
      console.log(' All atoms transformed to document format\n');
      callback(null, 'success');
    };
  });
};

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
  });

  var progressChunk = 100 / storage[semanticType].transformedAtoms.length;

  async.eachSeries(storage[semanticType].transformedAtoms
  , function uploadAtom(atom, callback) {

    elasticClient.index(atom, function (error, response) {
      uploadBar.tick(progressChunk);
      if (error) {
        console.error('elasticsearch cluster is down!');
        setImmediate(callback);
      } else {
        setImmediate(callback);
      };
    });

  }, function (err) {
    if (err) {
      callback(err)
    } else {
      console.log('   Success\n');
      callback();
    };
  });
};

function uploadAllAtoms(semanticTypes, callback) {
  console.log(' Uploading atoms\n');

  async.timesSeries(semanticTypes.length, uploadAtoms, function (err) {
    if (err) {
      callback(err)
    } else {
      console.log(' All atoms uploaded to ElasticSearch\n');
      callback(null, 'success');
    };
  });
};

// Close the MYSQL connection

function closeMYSQL(callback) {
  mysql.end();
  callback(null, 'success');
};

// Close the ElasticSearch connection

function closeElasticSearch(callback) {
  elasticClient.close();
  callback(null, 'success');
};

/*
* Execution
*/

async.series({

  // deleteIndex : function (nextFunction) {
  //   deleteIndex(acConfig.index, function (err, success) {
  //     if (err) {
  //       nextFunction(err);
  //     } else {
  //       nextFunction(null, success);
  //     };
  //   });
  // },

  // mapIndex : function (nextFunction) {
  //   mapIndex(acConfig.index, function (err, success) {
  //     if (err) {
  //       nextFunction(err);
  //     } else {
  //       nextFunction(null, success);
  //     };
  //   });
  // },

  initializeStorage : function (nextFunction) {
    initializeStorage(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, success);
      };
    });
  },

  initializeAtomCountQueries : function (nextFunction) {
    initializeAtomCountQueries(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, success);
      };
    });
  },

  countAtoms : function (nextFunction) {
    countAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, success);
      };
    });
  },

  initializeAtomRetrieveQueries : function (nextFunction) {
    initializeAtomRetrieveQueries(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, success);
      };
    });
  },

  storeAtoms : function (nextFunction) {
    storeAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, success);
      };
    });
  },

  transformAllAtoms : function (nextFunction) {
    transformAllAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, success);
      };
    });
  },

  uploadAllAtoms : function (nextFunction) {
    uploadAllAtoms(acConfig.semanticTypes, function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, success);
      };
    })
  },

  closeMYSQL : function (nextFunction) {
    closeMYSQL(function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, success);
      };
    });
  },

  closeElasticSearch : function (nextFunction) {
    closeElasticSearch(function (err, success) {
      if (err) {
        nextFunction(err);
      } else {
        nextFunction(null, success);
      };
    });
  },

  Afsluiting : function (nextFunction) {
      nextFunction(null, 'success');
  }

}, function (err, results) {
  if (err) {
    console.log(err);
  } else {
    console.log('\n\n Async results:\n', results, '\n');
  };
});