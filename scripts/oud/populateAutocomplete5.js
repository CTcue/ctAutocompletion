'use strict';

/*
* Module dependencies
*/

var config          = require('../config/config.js');
var mysql           = require('mysql').createConnection(config.mysql);
var async           = require('async');
var _               = require('lodash');
// var ProgressBar   = require('progress');
var stopWords       = require('./stopwords.json');

var elastic         = require('elasticsearch');
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
var elasticClient   = new elastic.Client(elasticOptions);

/*
* Global Variables
*/

var totalUploaded = 0;
var totalRecords  = 0;
var limit         = [0, 100]

var semanticTypes = [
    // "Sign or Symptom"
  // , "Pathologic Function"
  // , "Disease or Syndrome"
  // , "Mental or Behavioral Dysfunction"
  // , "Neoplastic Process"
  // , "Cell or Molecular Dysfunction"
  , "Experimental Model of Disease"
  // , "Injury or Poisoning"
  // , "Clinical Drug"
  ];

var retrieveQuery = [
  "SELECT b.CUI, b.AUI, a.STY, b.STR",
  "FROM MRSTY a, MRCONSO b",
  "WHERE a.STY IN ('"+ semanticTypes.join("', '") + "')",
  "AND a.CUI = b.CUI LIMIT " + limit.join(", ")
].join(' ');

var countQuery = [
  "SELECT COUNT(*)",
  "FROM MRSTY a, MRCONSO b",
  "WHERE a.STY IN ('"+ semanticTypes.join("', '") + "')",
  "AND a.CUI = b.CUI"
].join(' ');

/*
* Functions
*/

function retrieveAndUpload(limit, callback) {

  mysql.query(retrieveQuery, function (err, records) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {

      var currentUploaded = 0;
      for (var i = 0; i < records.length; i++) {

        records[i].input = _.filter(records[i].STR.split(' '), function(word) {
          return stopWords.english.concat(stopWords.dutch).indexOf(word) === -1
        });

        records[i].input.push(records[i].STR);

        var document = {
          "index" : "autocomplete",
          "type"  : records[i].STY.toLowerCase().replace(/\s/g, '_'),
          "body"  : {
            "atom"  : {
              "input"   : records[i].input,
              "output"  : records[i].STR,
              "payload" : {
                "cui"           : records[i].CUI,
                "aui"           : records[i].AUI,
                "semanticType"  : records[i].STY
              }
            }
          }
        };



        // console.log(JSON.stringify(document, null, 2));

        elasticClient.index(document, function (error, response) {
          if (error) {
            console.log(error);
            process.exit(1);
          } else {
            currentUploaded++;
            totalUploaded++;

            if (totalUploaded >= totalRecords) {
              console.log(
                '\n  Uploaded last '
                + i
                + ' of '
                + totalRecords
                + ' records.\n  Uploading complete.\n'
                );
              // callback();
            } else if (currentUploaded >= records.length) {
              console.log(
                '\n  Uploaded '
                + records.length
                + ' of '
                + totalRecords
                + ' records...'
                );
              callback();
            } else {
              console.log(currentUploaded, i, records.length);
              console.log(totalUploaded, totalRecords)
              // console.log(currentUploaded,totalUploaded, totalRecords)
            }
          }
        })


      };

      console.log('\n  current amount of records: ' + records.length + '\n');

    }
  });

};

// retrieveAndUpload();

// Pretend this is some complicated async factory
// var createUser = function(id, callback) {
//   callback(null, {
//     id: 'user' + id
//   })
// }
// // generate 5 users
// async.timesSeries(5, function(n, next){
//     createUser(n, function(err, user) {
//       console.log(user);
//       setTimeout(function () {
//         next(err, user)
//       }, 2000)
//     })
// }, function(err, users) {
//   // console.log(users)
//   // we should now have 5 users
// });

mysql.query(countQuery, function (err, count) {
  totalRecords = count[0]['COUNT(*)'];
  console.log('\n  Total records counted: ' + totalRecords);

  async.timesSeries(5, function (n, next) {
    retrieveAndUpload(n, function (err) {
      console.log('End of round');
      next();
    }, function (err) {
      mysql.end();
      elasticClient.close();
      console.log('End of cycle');
    });
  });

});