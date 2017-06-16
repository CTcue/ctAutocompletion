
var _ = require("lodash");


// Default category: `keyword`

module.exports = function getCategoryByTypes(types, data_source) {
    if (typeof data_source === "undefined") {
        data_source = "ctcue";
    }


    if (!types || typeof types === "undefined" || types.length === 0) {
        return "keyword";
    }


    if (_.includes(types, "PROC")) {
        if (_.includes(types, "T059")) {
            return "labresult";
        }
    }
    else if (_.includes(types, "DISO")) {
        return "keyword";
    }
    else if (isMedication(types, data_source)) {
        return "medication";
    }

    return "keyword";
}


function isMedication(types, data_source) {
    var notAnotomy = !_.includes(types, "ANAT");

    var possibleMed =
        _.includes(["RXNORM"], data_source.toUpperCase()) ||
        _.includes(types, "T200") ||
        _.includes(types, "T121");


    return notAnotomy && possibleMed;
}