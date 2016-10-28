
var _ = require("lodash");


// Default category: `keyword`

module.exports = function getCategoryByTypes(types, data_source) {
    if (typeof data_source === "undefined") {
        data_source = "ctcue";
***REMOVED***


    if (!types || typeof types === "undefined" || types.length === 0) {
        return "keyword";
***REMOVED***


    if (_.includes(types, "PROC")) {
        if (_.includes(types, "T059")) {
            return "labresult";
    ***REMOVED***
***REMOVED***
    else if (_.includes(types, "DISO")) {
        return "keyword";
***REMOVED***
    else if (isMedication(types, data_source)) {
        return "medication";
***REMOVED***

    return "keyword";
***REMOVED***


function isMedication(types, data_source) {
    var notAnotomy = !_.includes(types, "ANAT");

    var possibleMed =
        _.includes(["RXNORM"], data_source.toUpperCase()) ||
        _.includes(types, "T200") ||
        _.includes(types, "T121");


    return notAnotomy && possibleMed;
***REMOVED***