"use strict";

var _ = require("lodash");


exports.escapeRegExp = function(str) {
    return str.replace(/[\<\>\-\[\]\/\{\***REMOVED***\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
***REMOVED***

exports.escapeSpecial = function(str) {
***REMOVED*** Replaces all symbols to 'whitespace + dashes'
    return str.replace(/[^\w']/g, "[\\s-]")
***REMOVED***

exports.compareFn = function(s) {
    return _.deburr(s).trim().toLowerCase();
***REMOVED***

exports.forComparison = function(text) {
    if (!text) {
        return "";
***REMOVED***

    return _.deburr(text)
        .toLowerCase()
        .replace(/[^\w]/g, ' ') // symbols etc
        .replace(/\s+/g, ' ') // multi whitespace
        .trim();
***REMOVED***

exports.removeDashes = function(text) {
    return text
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
***REMOVED***


const suffix = [
    "type",
    "stage", "stadium",
    "phase", "fase",
];

// Roman numerals
// http://stackoverflow.com/a/9341749/951517
const roman = "[IVX]?(X{0,3***REMOVED***I{0,3***REMOVED***|X{0,2***REMOVED***VI{0,3***REMOVED***|X{0,2***REMOVED***I?[VX])";
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
***REMOVED***
