"use strict";

var _ = require("lodash");


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

exports.forComparison = function(text, lowerCase) {
    if (!text) {
        return "";
    }

    if (typeof lowerCase === "undefined") {
        lowerCase = true;
    }

    var clean = _.deburr(text)
        .replace(/[^\w]/g, ' ') // symbols etc
        .replace(/\s+/g, ' ')   // multi whitespace
        .trim();

    if (lowerCase) {
        clean = clean.toLowerCase();
    }

    return clean;
}
