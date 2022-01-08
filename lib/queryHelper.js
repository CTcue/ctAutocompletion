
const _ = require("lodash");
const config  = require("../config/config.js");
const string = require("./string");

const elastic = require("@elastic/elasticsearch");
const elasticClient = new elastic.Client({
    "node": config.elasticsearch.host,
    "auth": config.elasticsearch.auth
});

const language_map = {
    "DUT" : "dutch",
    "ENG" : "english"
};

exports.getTermsByLanguage = async function(cui) {
    var result = await exports.getTermsByCui(cui, 100);
    var pref = "";
    var types = [];
    var found_terms = [];

    if (result) {
        types = result[0];
        pref = result[1];
        found_terms = result[2];

        // Get unique terms per language
        found_terms = _.uniq(_.sortBy(found_terms, "lang"), s => string.compareFn(s.str));
    }

    // Group terms by language
    var terms = {};

    for (let i = 0; i < found_terms.length; i++) {
        const t = found_terms[i];

        // Skip two letter abbreviations
        if (!t["str"] || t["str"].length < 3) {
            continue;
        }

        let key = "custom";

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

    // Remove empty key/values, then sort terms by their length
    for (const k in terms) {
        if (!terms[k].length) {
            delete terms[k];
        }
        else {
            const unique = _.uniqBy(terms[k], s => string.forComparison(s));

            terms[k] = _.sortBy(unique, "length");
        }
    }

    return { terms, pref, types };
}

exports.getTermsByCui = async function(cui, size = 60) {
    if (!cui) {
        return undefined;
    }

    const query = {
        "index": config.elasticsearch.index,
        "size": size,
        "sort": ["_doc"],
        "_source": ["str", "lang", "types", "pref"],
        "body": {
            "query": {
                "term": {
                    "cui": cui
                 }
             }
        }
    };

    const response = await elasticClient.search(query);
    const result = _.get(response.body, "hits.hits", []);

    if (result.length) {
        const types = result[0]._source.types;
        const pref  = result[0]._source.pref;

        return [types, pref, result.map(s => s._source)];
    }

    return undefined;
}
