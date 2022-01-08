const _ = require("lodash");

exports.escapeRegExp = function(str) {
    return str.replace(/[\<\>\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

exports.escapeSpecial = function(str) {
    // Replaces all symbols to 'whitespace + dashes'
    return str.replace(/[^\w']/g, "[\\s-]")
}

exports.compareFn = function(s) {
    return _.deburr(s).trim().toLowerCase();
}

exports.forComparison = function(text, lowerCase = true) {
    if (!text) {
        return "";
    }

    const clean = _.deburr(text)
        .replace(/[^\w]/g, " ") // Replace symbols etc
        .replace(/\s+/g, " ")   // Reduce multiple whitespace
        .trim();

    if (lowerCase) {
        return clean.toLowerCase();
    }

    return clean;
}
