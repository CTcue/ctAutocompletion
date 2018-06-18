'use strict';


var config = require('../config/config.js');
var db     = require('monk')(config.mongodb.path);
var helper = db.helper;
var wrap   = require('co-monk');


var tables = {
    'umls': wrap(db.get('umls')),
};


exports.table = function(name) {
  if (tables.hasOwnProperty(name)) {
      return tables[name];
  }
  else if (sharedTables.hasOwnProperty(name)) {
      return sharedTables[name];
  }

  return false;
};


exports.ObjectId = function(id) {
    if (typeof id === 'undefined') {
        return helper.id();
    }

    return helper.toObjectID(id);
};


exports._tables = tables;
