
/** Module dependencies. */
var config = require('../config/config.js');
var _      = require('lodash');

var request   = require('request-json');
var reqClient = request.newClient(config.elastic + "/autocomplete/");

module.exports = function *() {
  var lookup =  {
    "result" : {
      "text" : this.body.query,
      "completion" : {
        "field" : "preferred",
        "size"  : "50",
        "fuzzy" : {
          "min_length"    : 4,
          "prefix_length" : 3
        }
      }
    }
  };

  reqClient.post("_suggest", lookup, function(err, res, body) {
    if (err) {
      return this.body = [];
    }
    else if (!body.hasOwnProperty('result')) {
      return this.body = [];
    }

    var hits   = body.result[0].options;
    var result = [];

    for (var i=0, N=hits.length; i<N; i++) {
      result[i] = {
        "_id" : hits[i].payload.cui,
        "str" : hits[i].payload.codes[0]
      };
    }

    this.body = result;
  });

  /*
  // If we have suggestions for given query
  if (set.options.length > 0) {
    // Get the payloads + best recommendations
    set = _.pluck(set.options, 'payload');
    set = filters.suggestionsFromElasticRecords(set, this.body.query);

    return this.body = set.slice(0, 12);
  }
  else {
    // No suggestions yet
    var words = this.body.query.words();

    // Does the query contain multiple words?
    if (words.length > 0) {
      suggestions = yield autocomplete.startsWith(words, this.params.type);

      if (suggestions.hits && suggestions.hits.total > 0) {
        var tmp = suggestions.hits.hits;
        set = [];

        for (var i=0, L=tmp.length; i<L; i++) {
          if (tmp[i]._score < 2)
            continue;

          set.push({
            "_id"   : tmp[i]._source.cui,
            "str"   : tmp[i]._source.terms[0]
          });
        }

        return this.body = set.slice(0, 12);
      }
    }
  }
  */
};
