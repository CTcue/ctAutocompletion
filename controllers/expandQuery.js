
var config = require('../config/config.js');
var client = require('../lib/requestClient.js');

module.exports = function *() {
  var path = config.elastic + "/expander/records/_search?size=1";

  var lookup = {
    "_source" : ["str"],
    "query": {
      "match": {
        "cui": this.body.query.toUpperCase()
      }
    }
  };

  var result = yield client.post(path, lookup);

  if (result.hits.total >= 1) {
    this.body = result.hits.hits[0]._source.str;
  }
  else {
    this.body = [];
  }
};
