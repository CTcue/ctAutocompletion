const _ = require("lodash");

module.exports = function getCategoryByTypes(types = [], data_source = "ctcue") {
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
    const notAnatomy = !_.includes(types, "ANAT");

    const possibleMed =
        _.includes(["RXNORM"], data_source.toUpperCase()) ||
        _.includes(types, "T200") ||
        _.includes(types, "T121");

    return notAnatomy && possibleMed;
}
