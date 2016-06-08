
var _ = require("lodash");


// Default category: `keyword`

module.exports = function getCategoryByTypes(types) {
    if (!types || typeof types === "undefined" || types.length === 0) {
        return "keyword";
***REMOVED***

    if (_.includes(types, "PROC")) {
        if (_.includes(types, "T059")) {
            return "labresult";
    ***REMOVED***
    ***REMOVED*** else if (_.includes(types, "T061")) {
    ***REMOVED***     return "procedure";
    ***REMOVED*** ***REMOVED***
***REMOVED***
    else if (_.includes(types, "DISO")) {
        return "keyword";
***REMOVED***
    else if (_.includes(types, "T200")) {
        return "medication";
***REMOVED***

    return "keyword";
***REMOVED***
