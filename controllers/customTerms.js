
var config = require('../config/config.js');
var elastic = require('elasticsearch');
var uuid   = require('node-uuid');
var _      = require("lodash");
var sha1   = require("../lib/sha1");

// Database
var db    = require('monk')(config.mongodb.path);
var wrap  = require('co-monk');
var table = wrap(db.get('customTerms'));

var elasticClient = new elastic.Client({
    "apiVersion" : "1.4"
});

module.exports = function *() {
    var body = this.request.body;

    // Insert custom term request in mongoDB
    if (!!body.custom) {
        body.created = new Date();
        var mongoResult = yield table.insert(body);
    }

    var cui = (!!body.cui && body.cui.length) ? body.cui : uuid.v4();

    for (var i=0, L=body.synonyms.length; i < L; i++) {
        var term  = body.synonyms[i].trim();

        cui = yield addAutocompleteTerm(cui, term);
    }

    this.body = yield addExpandList(cui, body.synonyms);
};


// Returns cui of item inserted
function addAutocompleteTerm(cui, term) {
    return function(callback) {
        var id = sha1.sum(term.toLowerCase());

        var newDocument = {
            "index" : "autocomplete",
            "type"  : "records",
            "id"    : id,
            "fields" : "_source",

            "body"  : {
                "doc" : {},

                "upsert" : {
                  "cui" : cui,
                  "str" : term
                }
            }
        };

        elasticClient.update(newDocument, function(err, response) {
            callback(err, response.get._source.cui);
        });
    }
}

function addExpandList(cui, terms) {
    return function(callback) {
        var updateDocument = {
            "index"  : "expander",
            "type"   : "records",
            "id"     : cui,
            "fields" : "_source",

            "body"  : {
                "script": "for (term in terms) { if (!ctx._source.str.contains(term)){ ctx._source.str += term; } }",
                "params" : {
                    "terms" : terms
                },

                "upsert" : {
                    "cui" : cui,
                    "str" : terms
                }
            }
        };

        elasticClient.update(updateDocument, function(err, response) {
            callback(err, response.get._source);
        });
    }
}
