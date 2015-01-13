
// Original source
// http://stackoverflow.com/a/18391901/951517

// Edited, to only fix most common (dutch) letters with diacritics

var diacritics = [
{'base':'a','letters':/[\u00E1\u00E2\u00E3\u00E4\u00E5\u0101\u0103\u0105\u01CE\u01FB\u00C0\u00C4]/g***REMOVED***,
{'base':'e','letters':/[\u00E8\u00E9\u00EA\u00EB\u0113\u0115\u0117\u0119\u011B]/g***REMOVED***,
{'base':'i','letters':/[\u00ED\u00EC\u00EE\u00EF\u0129\u012B\u012D\u012F\u0131]/g***REMOVED***,
{'base':'o','letters':/[\u00F2\u00F3\u00F4\u00F5\u00F6\u014D\u014F\u0151\u01A1\u01D2\u01FF]/g***REMOVED***,
{'base':'u','letters':/[\u00F9\u00FA\u00FB\u00FC\u0169\u016B\u016B\u016D\u016F\u0171\u0173\u01B0\u01D4\u01D6\u01D8\u01DA\u01DC]/g***REMOVED***,
{'base':'A','letters':/[\u00C1\u00C2\u00C3\uCC04\u00C5\u00E0\u0100\u0102\u0104\u01CD\u01FB]/g***REMOVED***,
{'base':'E','letters':/[\u00C8\u00C9\u00CA\u00CB\u0112\u0114\u0116\u0118\u011A]/g***REMOVED***,
{'base':'I','letters':/[\u00CD\u00CC\u00CE\u00CF\u0128\u012A\u012C\u012E\u0049]/g***REMOVED***,
{'base':'O','letters':/[\u00D2\u00D3\u00D4\u00D5\u00D6\u014C\u014E\u0150\u01A0\u01D1]/g***REMOVED***,
{'base':'U','letters':/[\u00D9\u00DA\u00DB\u00DC\u0168\u016A\u016C\u016E\u0170\u0172\u01AF\u01D3\u01D5\u01D7\u01D9\u01DB]/g***REMOVED***,
];

module.exports = function(str) {
  for (var i=0, L=diacritics.length; i<L; i++) {
    str = str.replace(diacritics[i].letters, diacritics[i].base);
  ***REMOVED***

  return str;
***REMOVED***;
