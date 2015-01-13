'use strict';

/** Module dependencies. */
var config = require('../config/config.js');
var _      = require('lodash');
var ct     = require('../lib/context');

var request   = require('request-json');
var reqClient = request.newClient(config.elastic + "/autocomplete/");

exports.fn = function(query, size, field) {
  var lookup =  {
    "suggest" : {
      "text" : query,
      "preferred" : {
        "field" : (field || "preferred"),
        "size"  : (size  || 50),
        "fuzzy" : {
          "min_length"    : 4,
          "prefix_length" : 3
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  return function(callback) {
    reqClient.post("records/_suggest", lookup, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***;

// Check edge ngrams + start position
// (i.e br tumor -> brain tumor, but NOT "tumor of brain")
exports.startsWith = function(words, size) {
  size = size || 12;

  var lookup = {
    "_source" : ["cui", "terms"],
    "query" : {
      "filtered": {
        "query":  { "match"  :  { "terms"     : words.join(' ') ***REMOVED******REMOVED***,
        "filter": { "prefix" :  { "preferred" : words[0] ***REMOVED******REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  return function(callback) {
    reqClient.post("records/_search?size=" + size, lookup, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***

// Looks for edge n-gram word matches
exports.words = function(words, size) {
  size = size || 12;

  var lookup = {
    "_source" : ["cui", "terms"],
    "query": {
      "match": {
        "words": words.join(' ')
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  return function(callback) {
    reqClient.post("records/_search?size=" + size, lookup, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***

// Looks for edge n-gram word matches
exports.expandCUI = function(query) {
  var lookup = {
    "_source" : ["cui", "terms"],
    "query": {
      "match": {
        "cui": query.toUpperCase()
  ***REMOVED***
***REMOVED***
  ***REMOVED***;

  return function(callback) {
    reqClient.post("_search?size=1", lookup, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***
