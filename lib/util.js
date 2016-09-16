'use strict';

exports.compareFn = function(s) {
    return _.deburr(s).trim().toLowerCase();
***REMOVED***

exports.forComparison = function(text) {
    if (!text) {
        return "";
***REMOVED***

    return text
        .toLowerCase()
        .replace(/[^\w]/g, ' ') // symbols etc
        .replace(/\s\s+/g, ' ') // multi whitespace
        .trim()
***REMOVED***