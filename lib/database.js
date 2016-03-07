'use strict';

var config = require('../config/config.js');

var db   = require('monk')(config.mongodb.path);
var helper = db.helper;
var wrap = require('co-monk');


var tables = {
  'umls' : wrap(db.get('umls')),
***REMOVED***;
exports._tables = tables;


exports.table = function(name) {
  if (tables.hasOwnProperty(name)) {
    return tables[name];
  ***REMOVED***
  else if (sharedTables.hasOwnProperty(name)) {
    return sharedTables[name];
  ***REMOVED***

  return false;
***REMOVED***;


exports.ObjectId = function(id) {
  if (typeof id === 'undefined') {
    return helper.id();
  ***REMOVED***

  return helper.toObjectID(id);
***REMOVED***;
