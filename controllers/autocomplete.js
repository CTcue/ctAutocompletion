'use strict';

/** Module dependencies. */
var config    = require('../config/config.js');
var _         = require('lodash');
var elastic   = require('elasticsearch');

var elasticClient = new elastic.Client({
  host : config.elastic
***REMOVED***);

var lookup =  {
  "index" : "autocomplete",
  "body" : {
    "suggest" : {
      "text" : "",
      "completion" : {
        "field" : "complete",
        "size"  : 50,
        "fuzzy" : {
          "min_length"    : 4,
          "prefix_length" : 3
    ***REMOVED***,

        "context" : { 
          "type" : []
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***;


exports.simple = function(query) {
  return function(callback) {
    lookup.body.suggest.text = query;
    lookup.body.suggest.completion.context.type = [
      "disease_or_syndrome",
      "sign_or_symptom",
      "neoplastic_process"
    ];

    elasticClient.suggest(lookup, function (err, res) {
      callback(err, res);
***REMOVED***);
  ***REMOVED***;
***REMOVED***;


exports.diagnosis = function(query) {
  return function(callback) {
    lookup.body.suggest.text = query;
    lookup.body.suggest.completion.context.type = [
      "disease_or_syndrome",
      "sign_or_symptom",
      "pathologic_function",
      "mental_or_behavioral_dysfunction",
      "cell_or_molecular_dysfunction",
      "injury_or_poisoning",
      "neoplastic_process", 
      "experimental_model_of_disease"
    ];

    elasticClient.suggest(lookup, function (err, res) {
      callback(err, res);
***REMOVED***);
  ***REMOVED***;
***REMOVED***;


exports.medicine = function(query) {
  return function(callback) {
    lookup.body.suggest.text = query;
    lookup.body.suggest.completion.context.type = [
      "clinical_drug"
    ];

    elasticClient.suggest(lookup, function (err, res) {
      callback(err, res);
***REMOVED***);
  ***REMOVED***;
***REMOVED***;

