"use strict";

var _ = require("lodash");


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