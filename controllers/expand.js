
var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});

var getCategory = require("./lib/category.js");

const source = ["str", "types"];


module.exports = function *() {

  var result = yield function(callback) {
      elasticClient.search({
          "index" : 'autocomplete',
          "size": 100,

          "_source": source,

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
            callback(false, resp.hits.hits);
          }
          else {
            callback(err, []);
          }
      });
  };

  if (result && result.length > 0) {
      var types = result[0]._source.types;

      return this.body = {
        "type"      : "-",
        "category"  : getCategory(types),
        "terms"     : result.map(function(item) { return item._source.str; })
      };
  }

  this.body = { "type": "", "category": "", "terms": [] }
};

