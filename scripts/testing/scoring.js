#!/usr/bin/env node
'use strict';

var sugar   = require('sugar');
var _       = require('lodash');
var utf8    = require('utf8');

var diacritics = [
    {'base':'a','letters':/[\u00E1\u00E2\u00E3\u00E4\u00E5\u0101\u0103\u0105\u01CE\u01FB\u00C0\u00C4]/g***REMOVED***,
    {'base':'ae','letters':/[\u00E6\u01FD]/g***REMOVED***,
    {'base':'c','letters':/[\u00E7\u0107\u0109\u010B\u010D]/g***REMOVED***,
    {'base':'d','letters':/[\u010F\u0111\u00F0]/g***REMOVED***,
    {'base':'e','letters':/[\u00E8\u00E9\u00EA\u00EB\u0113\u0115\u0117\u0119\u011B]/g***REMOVED***,
    {'base':'f','letters':/[\u0192]/g***REMOVED***,
    {'base':'g','letters':/[\u011D\u011F\u0121\u0123]/g***REMOVED***,
    {'base':'h','letters':/[\u0125\u0127]/g***REMOVED***,
    {'base':'i','letters':/[\u00ED\u00EC\u00EE\u00EF\u0129\u012B\u012D\u012F\u0131]/g***REMOVED***,
    {'base':'ij','letters':/[\u0133]/g***REMOVED***,
    {'base':'j','letters':/[\u0135]/g***REMOVED***,
    {'base':'k','letters':/[\u0137\u0138]/g***REMOVED***,
    {'base':'l','letters':/[\u013A\u013C\u013E\u0140\u0142]/g***REMOVED***,
    {'base':'n','letters':/[\u00F1\u0144\u0146\u0148\u0149\u014B]/g***REMOVED***,
    {'base':'o','letters':/[\u00F2\u00F3\u00F4\u00F5\u00F6\u014D\u014F\u0151\u01A1\u01D2\u01FF]/g***REMOVED***,
    {'base':'oe','letters':/[\u0153]/g***REMOVED***,
    {'base':'r','letters':/[\u0155\u0157\u0159]/g***REMOVED***,
    {'base':'s','letters':/[\u015B\u015D\u015F\u0161]/g***REMOVED***,
    {'base':'t','letters':/[\u0163\u0165\u0167]/g***REMOVED***,
    {'base':'u','letters':/[\u00F9\u00FA\u00FB\u00FC\u0169\u016B\u016B\u016D\u016F\u0171\u0173\u01B0\u01D4\u01D6\u01D8\u01DA\u01DC]/g***REMOVED***,
    {'base':'w','letters':/[\u0175]/g***REMOVED***,
    {'base':'y','letters':/[\u00FD\u00FF\u0177]/g***REMOVED***,
    {'base':'z','letters':/[\u017A\u017C\u017E]/g***REMOVED***,
    {'base':'A','letters':/[\u00C1\u00C2\u00C3\uCC04\u00C5\u00E0\u0100\u0102\u0104\u01CD\u01FB]/g***REMOVED***,
    {'base':'AE','letters':/[\u00C6]/g***REMOVED***,
    {'base':'C','letters':/[\u00C7\u0106\u0108\u010A\u010C]/g***REMOVED***,
    {'base':'D','letters':/[\u010E\u0110\u00D0]/g***REMOVED***,
    {'base':'E','letters':/[\u00C8\u00C9\u00CA\u00CB\u0112\u0114\u0116\u0118\u011A]/g***REMOVED***,
    {'base':'G','letters':/[\u011C\u011E\u0120\u0122]/g***REMOVED***,
    {'base':'H','letters':/[\u0124\u0126]/g***REMOVED***,
    {'base':'I','letters':/[\u00CD\u00CC\u00CE\u00CF\u0128\u012A\u012C\u012E\u0049]/g***REMOVED***,
    {'base':'IJ','letters':/[\u0132]/g***REMOVED***,
    {'base':'J','letters':/[\u0134]/g***REMOVED***,
    {'base':'K','letters':/[\u0136]/g***REMOVED***,
    {'base':'L','letters':/[\u0139\u013B\u013D\u013F\u0141]/g***REMOVED***,
    {'base':'N','letters':/[\u00D1\u0143\u0145\u0147\u0149\u014A]/g***REMOVED***,
    {'base':'O','letters':/[\u00D2\u00D3\u00D4\u00D5\u00D6\u014C\u014E\u0150\u01A0\u01D1]/g***REMOVED***,
    {'base':'OE','letters':/[\u0152]/g***REMOVED***,
    {'base':'R','letters':/[\u0154\u0156\u0158]/g***REMOVED***,
    {'base':'S','letters':/[\u015A\u015C\u015E\u0160]/g***REMOVED***,
    {'base':'T','letters':/[\u0162\u0164\u0166]/g***REMOVED***,
    {'base':'U','letters':/[\u00D9\u00DA\u00DB\u00DC\u0168\u016A\u016C\u016E\u0170\u0172\u01AF\u01D3\u01D5\u01D7\u01D9\u01DB]/g***REMOVED***,
    {'base':'W','letters':/[\u0174]/g***REMOVED***,
    {'base':'Y','letters':/[\u0178\u0176]/g***REMOVED***,
    {'base':'Z','letters':/[\u0179\u017B\u017D]/g***REMOVED***
];

function removeDiacritics(str) {
  for(var i=0, L=diacritics.length; i<L; i++) {
    str = str.replace(diacritics[i].letters, diacritics[i].base);
  ***REMOVED***

  return str;
***REMOVED***

var texts = [
  [ "spondylitis; reumatoÃ¯d"],
  [ "wervel{kolom***REMOVED***; artritis, Marie-StrÃ¼mpell"],
  [ "reumatoÃ¯de spondylitis" ],
  [ "Marie StrÃ¼mpell spondylitis" ],
  [ "Bechterev' s dis"],

  /*
  [
    "ankylosing spondylarthritis and/or eye lesions"
  ],

  [
    "ankylosing, spondylitis",
    "ziekte van mary strumpëll"
  ],

  [
    "ankylosing spondylitis occipito atlanto axial region"
  ],

  [
    "ankyloserende spondylitis en andere inflammatoire spondylopathie",
    "ankylosing spondylitis and other inflammatory spondylopathies"
  ]*/
];

for (var i=0, L=texts.length; i<L; i++) {
  var definitions = _.uniq(_.map(texts[i], function(str) {
  ***REMOVED***
        str = utf8.decode(str);

        return removeDiacritics(str)
            .toLowerCase()
            .replace(/\W+/g, " ")
            .replace(/  /g, " ")
            .trim();
  ***REMOVED***
  ***REMOVED***
        return "";
  ***REMOVED***
***REMOVED***));

  var words = _.map(definitions, function(str) {
    return _.reject( str.words(), function(str) {
      return str.length < 5;
***REMOVED***);
  ***REMOVED***);

  console.log(texts[i]);
  console.log(words);
***REMOVED***
