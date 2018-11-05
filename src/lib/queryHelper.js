
const _ = require("lodash");
const elasticHelper = require("./elasticHelper");
const elasticClient = elasticHelper.client();

const stringLib = require("./string");

const language_map = {
    "DUT" : "dutch",
    "ENG" : "english"
};


exports.getTermsByCui = async function (cui, size = 60) {
    if (!cui) {
        return false;
    }

    const findBy = {
        "index": "autocomplete",
        "size": size,
        "sort": ["_doc"],
        "_source": ["str", "lang", "types", "pref"],

        "body" : {
            "query" : {
                "term": {
                    "cui": cui
                }
            }
        }
    }

    const response = await elasticClient.search(findBy) || {};
    const hits = _.get(response, "hits.hits", []);

    if (_.isEmpty(hits)) {
        return [];
    }

    const prefHit = _.first(hits);

    const types = _.get(prefHit, "_source.types", "");
    const preferred = _.get(prefHit, "_source.pref", "");
    const sources = hits.map((s) => s._source);

    return [types, preferred, sources];
}


// @input : The `getTermsByCui` result
exports.groupTerms = function(result) {
    [types, preferred, sources] = result;

    // Group terms by label / language
    const terms = {};
    const foundTerms = _.uniq(_.sortBy(sources, "lang"), (s) => stringLib.compareFn(s.str));

    for (const t of foundTerms) {
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
    for (var k in terms) {
        if (!terms[k].length) {
            delete terms[k];
        }
        else {
            const unique = _.uniqBy(terms[k], s => stringLib.forComparison(s));
            terms[k]   = _.sortBy(unique, "length");
        }
    }

    return {
        "pref": preferred,
        "terms": terms
    };
}
