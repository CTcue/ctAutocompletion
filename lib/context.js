
exports.getContext = function(type) {
  var context = [];

  if (type == "diagnosis") {
    context = [
      "disease_or_syndrome",
      "sign_or_symptom",
      "pathologic_function",
      "mental_or_behavioral_dysfunction",
      "cell_or_molecular_dysfunction",
      "injury_or_poisoning",
      "neoplastic_process", 
      "experimental_model_of_disease"
    ];
  ***REMOVED***
  else if (type == "medicine") {
    context = [
      "clinical_drug"
    ];
  ***REMOVED***
  ***REMOVED***
    context = [
      "disease_or_syndrome",
      "sign_or_symptom",
      "neoplastic_process"
    ];
  ***REMOVED***

  return context;
***REMOVED***