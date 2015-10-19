
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});

module.exports = function *() {
  var result = yield function(callback) {
      elasticClient.search({
          "index" : 'autocomplete',
          "type"  : 'records',
          "body" : {
              "query" : {
                  "term" : {
                      "cui" : this.request.body.query
                   }
               }
          }
      },
      function(err, resp) {
          if (resp && !!resp.hits && resp.hits.total > 0) {
            callback(false, resp.hits.hits.map(function(item) {
                return item._source.str;
            }));
          }
          else {
            callback(err, []);
          }
      });
  };

  this.body = result;
};
