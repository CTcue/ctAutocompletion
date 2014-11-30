'use strict';

/** Module dependencies. */
var config    = require('../config/config.js');
var _         = require('lodash');
var elastic   = require('elasticsearch');

var elasticClient = new elastic.Client({
  host : config.elastic
});

exports.fn = function(query, type, size, field) {
  var lookup =  {
    "index" : "autocomplete",
    "body" : {
      "suggest" : {
        "text" : query,
        "completion" : {
          "field" : (field || "complete"),
          "size"  : (size  || 50),
          "fuzzy" : {
            "min_length"    : 4,
            "prefix_length" : 3
          },
          "context" : { 
            "type" : []
          }
        }
      }
    }
  };

  if (type == "diagnosis") {
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
  }
  else if (type == "medicine") {
    lookup.body.suggest.completion.context.type = [
      "clinical_drug"
    ];
  }
  else {
    lookup.body.suggest.completion.context.type = [
      "disease_or_syndrome",
      "sign_or_symptom",
      "neoplastic_process"
    ];
  }
  
  return function(callback) {
    elasticClient.suggest(lookup, function (err, res) {
      callback(err, res);
    });
  };
};
