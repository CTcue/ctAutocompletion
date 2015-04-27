
var config = require('../config/config.js');
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});

module.exports = function *() {
  var result = yield function(callback) {
      elasticClient.search({
          "index" : 'expander',
          "type"  : 'records',
          "body" : {
              "query" : {
                  "term" : {
                      "cui" : this.body.query
                   }
               }
          }
      },
      function(err, resp) {
          if (resp && !!resp.hits && resp.hits.total > 0) {
            callback(false, resp.hits.hits[0]._source.str);
          }
          else {
            callback(err, []);
          }
      });
  };

  this.body = result;
};
