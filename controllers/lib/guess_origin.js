
// Very simple check for now
module.exports = function(query) {
    query = query.trim();

    if (query.length >= 3) {
        // Is all numeric
        if (/^\d+$/.test(query)) {
            return "code";
        }
        // Check for CUI code
        else if (/^C\d+$/.test(query)) {
            return "cui";
        }
    }

    return "default";
}