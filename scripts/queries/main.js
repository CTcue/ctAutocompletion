
var semanticTypes = [
  "Pharmacologic Substance",
  "Antibiotic",

  "Organic Chemical",

  "Sign or Symptom",
  "Disease or Syndrome",
    "Mental or Behavioral Dysfunction",
    "Neoplastic Process",

  "Cell or Molecular Dysfunction",
  "Injury or Poisoning"
];


exports.countQuery = "SELECT COUNT(CUI) as count FROM MRSTY WHERE STY in (\"" + semanticTypes.join("\",\"") + "\")";
exports.preferredQuery = "SELECT a.CUI, b.STY FROM MRCONSO a INNER JOIN MRSTY b ON (a.CUI = b.CUI) WHERE SAB=\"SNOMEDCT_US\" AND TS=\"P\" AND STT=\"PF\" AND ISPREF=\"Y\" AND b.STY in (\"" + semanticTypes.join("\",\"") + "\")";