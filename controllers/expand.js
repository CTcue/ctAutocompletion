
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
            callback(false, resp.hits.hits);
          }
          else {
            callback(err, []);
          }
      });
  };

  var types = result[0]._source.types;

  this.body = {
    "type": "-",
    "category": typeToCategory(types),
    "terms": result.map(function(item) { return item._source.str; })
  };
};


function typeToCategory(types) {
    if (!types || typeof types === "undefined" || types.length === 0) {
        return "diagnosis";
    }

    var medication = ["medication", "Pharmacologic Substance", "product"]
    var labresult  = ["Laboratory Procedure", "Chemical/Ingredient"]

    return inList(types, medication, "medication") ||
           inList(types, labresult, "labresult") ||
           "diagnosis";
}

function inList(haystack, search, type) {
    for (var i=0; i<search.length; i++) {
          if (haystack.indexOf(search[i]) >= 0) {
              return type;
          }
    }

    return false;
}
