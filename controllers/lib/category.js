//////
// TODO
// Simple machine learning algo: Based on types -> give statistically most likely category
// Example: Calcium has types
// [ 'substance',
// 'Biologically Active Substance',
// 'Element, Ion, or Isotope',
// 'Chemical/Ingredient',
// 'Pharmacologic Substance',
// 'medication' ]
//
// And given Chemical/Ingredient and substance it's most likely a labresult.


// Default type: `keyword`
module.exports = function getCategoryByTypes(types) {
    if (!types || typeof types === "undefined" || types.length === 0) {
        return "keyword";
    }

    var dbc        = ["DBC", "dbc", "zorgproduct"];
    var medication = ["medication", "Pharmacologic Substance", "product"];
    var labresult  = ["Finding", "Laboratory Procedure", "Laboratory or Test Result", "Chemical/Ingredient"];

    return inList(types, dbc, "dbc")               ||
           inList(types, medication, "medication") ||
           inList(types, labresult, "labresult")   ||
           "keyword";
}

function inList(haystack, search, type) {
    for (var i=0; i<search.length; i++) {
        if (haystack.indexOf(search[i]) >= 0) {
            return type;
        }
    }

    return false;
}
