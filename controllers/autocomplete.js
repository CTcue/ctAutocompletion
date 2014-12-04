'use strict';

/** Module dependencies. */
var config = require('../config/config.js');
var _      = require('lodash');
var ct     = require('../lib/context');

var request   = require('request-json');
var reqClient = request.newClient(config.elastic + "/autocomplete/");

exports.fn = function(query, type, size, field) {
  var lookup =  {
    "suggest" : {
      "text" : query,
      "completion" : {
        "field" : (field || "complete"),
        "size"  : (size  || 50),
        "fuzzy" : {
          "min_length"    : 4,
          "prefix_length" : 3
    ***REMOVED***,
        "context" : { 
          "type" : ct.getContext(type)
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  return function(callback) {
    reqClient.post("_suggest", lookup, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***;
 
// Check edge ngrams + start position 
// (i.e br tumor -> brain tumor, but NOT "tumor of brain")
exports.startsWith = function(words, type, size) {
  size = size || 12;

  var context = ct.getContext(type);

  var lookup = {
    "_source" : ["cui", "terms"],
    "query" : {
      "filtered": {
        "query":  { "match"  :  { "words"      : words.join(' ') ***REMOVED******REMOVED***,
        "filter": { "prefix" :  { "startsWith" : words[0] ***REMOVED******REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  return function(callback) {
    reqClient.post(context.join(',') + "/_search?size=" + size, lookup, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***

// Looks for edge n-gram word matches 
exports.words = function(words, type, size) {
  size = size || 12;

  var context = ct.getContext(type);
  
  var lookup = {
    "_source" : ["cui", "terms"],
    "query": {
      "match": {
        "words": words.join(' ')
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  return function(callback) {
    reqClient.post(context.join(',') + "/_search?size=" + size, lookup, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***

// Looks for edge n-gram word matches 
exports.expandCUI = function(query, type, size) {
  size = size || 12;

  var context = ct.getContext(type);
  
  var lookup = {
    "_source" : ["cui", "terms"],
    "query": {
      "term": {
        "cui": query
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  return function(callback) {
    reqClient.post(context.join(',') + "/_search?size=" + size, lookup, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***
