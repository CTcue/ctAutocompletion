
// Convert digit to CUI code (C + some number);
module.exports = function(num) {
  return "C" + String("0000000" + num).slice(-7);
};
