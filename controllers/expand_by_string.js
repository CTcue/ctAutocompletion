
/** Usage

  curl -X POST -H "Content-Type: application/json" -d "{
      "query": "C1306459"
  }" "http://localhost:4080/expand-by-string"

*/

const config  = require("../config/config");

const _ = require("lodash");
const string = require("../lib/string");
const queryHelper = require("../lib/queryHelper");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

const language_map = {
    "DUT" : "dutch",
    "ENG" : "english"
};

/** @deprecated */
module.exports = function *(next) {
    const body = this.request.body;
    const term = _.get(body, "query") || null;

    if (!term || term.length < 3) {
        this.body = null;
        return;
    }

    // Exact term is indexed without dashes
    const wantedTerm = term
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const queryObj = {
        "index" : "autocomplete",
        "size"  : 1,

        "body": {
            "query": {
                "term" : {
                    "exact" : wantedTerm
                }
            }
        }
    };

    const cuiResult = yield function(callback) {
        elasticClient.search(queryObj, function(err, esRes) {
            if (err) {
                callback(false, false);
            }

            callback(false, _.get(esRes.body, "hits.hits.0._source") || false);
        });
    };

    if (!cuiResult) {
        this.body = null;
        return;
    }

    const result      = yield queryHelper.getTermsByCui(_.get(cuiResult, "cui"));
    const pref        = "";
    const found_terms = [];

    if (result) {
        types       = result[0];
        pref        = result[1];
        found_terms = result[2];

        // Get unique terms per language
        found_terms = _.uniq( _.sortBy(found_terms, "lang"), s => string.compareFn(s.str) );
    }


    // Group terms by label / language
    const terms = {
        "custom"   : [],
        "suggested": []
    };

    for (let i=0; i < found_terms.length; i++) {
        const t = found_terms[i];
        let key = "custom";

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
            terms[key] = [t["str"]];
        }
    }

    // - Remove empty key/values
    // - Sort terms by their length

    for (let k in terms) {
        if (!terms[k].length) {
            delete terms[k];
        }
        else {
            const unique = _.uniqBy(terms[k], s => string.forComparison(s));
            terms[k] = _.sortBy(unique, "length");
        }
    }

    this.body = {
      "cui"      : _.get(cuiResult, "cui") || null,
      "pref"     : pref,
      "terms"    : terms,
      "uncheck"  : []
    };

    // For logging
    this.pref_term = pref;

    yield next;
};
