
var config  = require('../config/config.js');
var elastic = require('elasticsearch');
var _       = require("lodash");
var sha1    = require("../lib/sha1");

// Database
var db    = require('monk')(config.mongodb.path);
var wrap  = require('co-monk');
var table = wrap(db.get('customTerms'));

var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});

module.exports = function *() {
    var body = this.request.body.object;

    // Filter out CUI codes that the user already selected
    var record = yield function(callback) {
        elasticClient.delete({
            "index" : 'autocomplete',
            "type"  : 'records',
            "id"    : sha1.sum(body.str.toLowerCase().trim())
        },
        function(err, resp) {
            callback(err, resp);
        });
    }

    var synonyms = yield function(callback) {
        elasticClient.get({
            "index" : 'expander',
            "type"  : 'records',
            "id"    : body.cui
        },
        function(err, resp) {
            callback(err, resp);
        });
    }

    if (synonyms) {
        var update = yield function(callback) {
            var filtered = _.reject(synonyms._source.str, function(str) {
              return str.toLowerCase() === body.str.toLowerCase();
            });

            elasticClient.update({
                "index" : 'expander',
                "type"  : 'records',
                "id"    : body.cui,
                "body"  : {
                    "doc" : {
                        "str" : filtered
                    }
                }
            },
            function(err, resp) {
                callback(err, resp);
            });
        }
    }

    this.body = true;
};
