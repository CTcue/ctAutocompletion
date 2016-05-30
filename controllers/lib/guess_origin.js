
// Very simple check for now
module.exports = function(query) {
    query = query.trim();

    if (query.length >= 3) {
    ***REMOVED*** Is all numeric
        if (/^\d+$/.test(query)) {
            return "code";
    ***REMOVED***
    ***REMOVED*** Check for CUI code
        else if (/^C\d+$/.test(query)) {
            return "cui";
    ***REMOVED***
***REMOVED***

    return "default";
***REMOVED***