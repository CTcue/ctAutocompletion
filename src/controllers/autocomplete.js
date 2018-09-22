
const _ = require("lodash");
const stringLib = require("../lib/string");

const elasticHelper = require("../lib/elasticHelper");
const elasticClient = elasticHelper.client();


const FIELDS = ["cui", "str", "pref"];


module.exports = async function autocomplete(ctx) {
    const start = Date.now();
    const body = ctx.request.body;
    const query = String(body.query).trim();

    // Limit to N characters input;
    const clean = _.deburr(query).slice(0, 42);

    if (!query || query === "") {
        ctx.body = {
            "took": Math.ceil(Date.now() - start),
            "hits": []
        };

        return;
    }


    const exactQuery = {
        "index": "autocomplete",
        "size" : 4,

        "body": {
            "_source": { "includes": FIELDS },

            "query": {
                "term" : {
                    "str": clean.toLowerCase()
                }
            }
        }
    };

    const exactResponse = await elasticClient.search(exactQuery) || {};
    const exactHits = getResponseSources(exactResponse) || [];


    const matchQuery = {
        "index": "autocomplete",
        "size" : 12,

        "body": {
            "_source": { "includes": FIELDS },

            "query": {
                "match_phrase" : {
                    "str": clean
                }
            }
        }
    };

    const matchResponse = await elasticClient.search(matchQuery) || {};
    const matchHits = getResponseSources(matchResponse) || [];


    // if (_.isEmpty(matchHits) && matchHits.length < 4)


    const allMatches = [].concat(exactHits, matchHits, []);

    // const matchCompareStrings = allMatches.map(s => s["str"].toLowerCase());
    // const uniqueHits = generateTerms(allMatches, matchCompareStrings);


    ctx.body = {
        "took": Math.ceil(Date.now() - start),
        "hits": reducePayload(allMatches)
    };
};


function getResponseSources(response = {}) {
    return _.get(response, "hits.hits", []).map(r => {
        return _.get(r, "_source", {});
    });
}


// Groups by CUI and strips 'pref' if it's exactly the same as str
const uniqueFn = (s) => s["pref"].trim().replace("-", " ").toLowerCase();

function reducePayload(hits = []) {
    const result = [];
    const grouped = _.groupBy(hits, "cui");

    for (const cui in grouped) {
        const tmp = grouped[cui][0];

        if (grouped[cui].length > 1) {
            const mapped = grouped[cui].map(uniqueFn);
            tmp.pref = _.uniqBy(mapped).join(", ");
            result.push(tmp)
        }
        else {
            if (tmp.str.toLowerCase() === tmp.pref.toLowerCase()) {
                tmp["pref"] = "";
            }

            result.push(tmp)
        }
    }

    return result;
}


// Add custom terms if there is a certain pattern:
// - "Gleason score" 5
// - "Diabetes mellitus" type 2
// - "Diabetes mellitus" type II
//
// The part between quotes can be the search term, in some cases,
// but this is usually not an UMLS concept

function generateTerms(unique, strings) {
    const generated = _.map(strings, stringLib.replaceAppendix);

    const toAdd = _.uniq(_.filter(generated, function(s) {
        return !_.includes(strings, s);
    }));

    const added = [];

    for (const term of toAdd) {
        added.push({
            "str"      : term,
            "pref"     : "",
            "cui"      : "generated",
        });
    }

    return [].concat(added, unique);
}
