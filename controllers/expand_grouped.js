"use strict";

/** Usage

  curl -X POST -H "Content-Type: application/json" -d '{
      "query": "C1306459"
  }' "http://localhost:4080/expand-grouped"

*/

const _ = require("lodash");
const string = require("../lib/string");
const queryHelper = require("../lib/queryHelper");
const getCategory = require("../lib/category");

const language_map = {
    "DUT" : "dutch",
    "ENG" : "english"
};

/** @deprecated */
module.exports = function *(next) {
    var cui = this.request.body.query || "";

    var result      = yield queryHelper.getTermsByCui(cui, 100);
    var pref        = "";
    var types       = [];
    var found_terms = [];

    if (result) {
        types       = result[0];
        pref        = result[1];
        found_terms = result[2];

        // Get unique terms per language
        found_terms = _.uniq( _.sortBy(found_terms, "lang"), s => string.compareFn(s.str) );
    }

    // Group terms by label / language
    var terms = {};

    for (var i=0; i < found_terms.length; i++) {
        var t = found_terms[i];
        var key = "custom";

        // Skip two letter abbreviations
        if (!t["str"] || t["str"].length < 3) {
            continue;
        }

        if (t.hasOwnProperty("label")) {
            key = t["label"].toLowerCase();
        }
        else if (t.hasOwnProperty("lang")) {
            key = language_map[t["lang"]] || "custom";
        }


        if (terms.hasOwnProperty(key)) {
            terms[key].push(t["str"]);
        }
        else {
            terms[key] = [ t["str"] ];
        }
    }

    // - Remove empty key/values
    // - Sort terms by their length
    for (var k in terms) {
        if (! terms[k].length) {
            delete terms[k];
        }
        else {
            var unique = _.uniqBy(terms[k], s => string.forComparison(s));
            terms[k]   = _.sortBy(unique, "length");
        }
    }


    this.body = {
      "category" : getCategory(types),
      "pref"     : pref,
      "terms"    : terms,
      "uncheck"  : []
    };


    // For logging
    this.pref_term = pref;
    yield next;
};
