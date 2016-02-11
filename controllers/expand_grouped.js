
var _ = require("lodash");

var elastic = require('elasticsearch');
var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});

var getCategory = require("./lib/category.js");

const source = ["str", "lang", "types"];
const language_map = {
  "DUT" : "dutch",
  "ENG" : "english",
  "default": "custom"
};

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

      var terms = {
          "english" : [],
          "dutch"   : [],
          "custom"  : []
      };

      // Group terms by language
      for (var i=0; i < result.length; i++) {
          var lang = result[i]["_source"]["lang"];

          if (! language_map.hasOwnProperty(lang)) {
              lang = "default";
          }

          terms[language_map[lang]].push(result[i]["_source"]["str"]);
      }


      // - Remove empty key/values
      // - Sort terms by their length
      for (var k in terms) {
          if (! terms[k].length) {
              delete terms[k];
          }
          else {
              terms[k] = _.sortBy(terms[k], "length");
          }
      }


      return this.body = {
        "category"  : getCategory(types),
        "terms"     : terms
      };
  }

  this.body = { "type": "", "category": "", "terms": [] }
};
