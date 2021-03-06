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

exports.removeDashes = function(text) {
    return text
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}


const suffix = [
    "type",
    "stage", "stadium",
    "phase", "fase",
];

// Roman numerals
// http://stackoverflow.com/a/9341749/951517
const roman = "[IVX]?(X{0,3}I{0,3}|X{0,2}VI{0,3}|X{0,2}I?[VX])";
const num   = "[0-9]+";


const num_suffix   = suffix.map(s => s + "\\s" + num);
const roman_suffix = suffix.map(s => s + "\\s" + roman);


const re_combination = [].concat(num_suffix, roman_suffix, num);
const re_sorted      = _.sortBy(_.flatten(re_combination), "length").reverse();
const re_regex       = new RegExp("(" + re_sorted.join("|") + ")$", "i");

exports.replaceAppendix = function(text) {
    return text.trim()
        .replace(re_regex, "")
        .trim();
}
