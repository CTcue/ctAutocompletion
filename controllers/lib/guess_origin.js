
// Very simple check for now
module.exports = function(query) {
    var isnum = /^\d+$/.test(query.trim());

***REMOVED*** If only numbers && query length is > 3, assume it's DBC / Some type of code
    if (isnum && query.length >= 3) {
        return "code";
***REMOVED***

    return "record";
***REMOVED***