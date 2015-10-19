
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
***REMOVED***);

module.exports = function *() {
  var result = yield function(callback) {
      elasticClient.search({
          "index" : 'autocomplete',
          "type"  : 'records',
          "body" : {
              "query" : {
                  "term" : {
                      "cui" : this.request.body.query
               ***REMOVED***
           ***REMOVED***
      ***REMOVED***
  ***REMOVED***,
      function(err, resp) {
          if (resp && !!resp.hits && resp.hits.total > 0) {
            callback(false, resp.hits.hits.map(function(item) {
                return item._source.str;
        ***REMOVED***));
      ***REMOVED***
          ***REMOVED***
            callback(err, []);
      ***REMOVED***
  ***REMOVED***);
  ***REMOVED***;

  this.body = result;
***REMOVED***;
