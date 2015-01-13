
var _ = require("lodash");

// Extremely simple model
// - Having alternative languages is better (i.e. its most likely more used)
// - Terms with 1 to 3 words are preferred (many words are penalized)
var score = function(terms, altTerms) {
  // Base boosting score
  var score = 1.0;

  var stats = _.reduce(terms, function(sum, str) {
    var wordCount = ~str.indexOf(" ") ? str.match(/ - |-| /g).length + 1 : 1;

    return {
      "words" : sum.words + wordCount,
      "chars" : sum.chars + str.length
    };

  }, { "words" : 0.0, "chars" : 0.0 });

  stats.avgWords = stats.words / terms.length;
  stats.avgChars = stats.chars / terms.length;

  // There are alternative terms in different languages
  if (altTerms.length > 0) {
    score += 0.15;
  }

  // Average word count
  if (stats.avgWords > 7) {
    score -= 0.3;
  }
  else if (stats.avgWords > 6 || terms.length === 1 && stats.avgWords > 4.9) {
    score -= 0.2;
  }
  else if (stats.avgWords > 5) {
    score -= 0.15;
  }
  else if (stats.avgWords > 4) {
    score -= 0.1;
  }
  else if (stats.avgWords > 3) {
    score -= 0.05;
  }

  // Average characters in string
  if (stats.avgChars > 70) {
    score -= 0.2;
  }
  if (stats.avgChars > 50) {
    score -= 0.15;
  }
  else if (stats.avgChars > 40) {
    score -= 0.05;
  }

  return score;
};
module.exports = score;



// Do test cases
if (typeof process.argv[2] !== 'undefined' && process.argv[2] === "test") {
  var cases = [
  {
    "eng" : [
        "Malignant neoplasm of oropharynx",
        "Cancer of oropharynx",
        "Malignant tumor of mesopharynx",
        "Malignant tumour of mesopharynx",
        "Malignant tumor of oropharynx",
        "Malignant tumour of oropharynx",
        "CA - Cancer of oropharynx"
    ],

    "dut" : []
  },
  {
    "eng" : [
      "Ankylosing spondylitis",
      "Bekhterev's disease",
      "Rheumatoid spondylitis",
      "Rheumatoid arthritis of spine",
      "Marie-Strumpell spondylitis",
      "Marie Strumpell spondylitis",
      "AS - Ankylosing spondylitis",
      "Idiopathic ankylosing spondylitis"
    ],

    "dut" : [
        "Ziekte van Marie-Strumpell",
        "Bechterew, ziekte van",
        "Spondylarthritis ankylopoetica",
        "Spondylitis ankylopoetica",
        "Ziekte van Bechterew",
        "Marie-Strumpell, ziekte van",
        "Reumatoide spondylitis",
        "Spondylitis ankylopoetica [Bechterew]",
        "ankyloserende spondylitis"
    ]
  },

  {
    "eng" : [
      "Juvenile ankylosing spondylitis",
      "AS - Juvenile ankylosing spondylitis"
    ],

    "dut" : [
      "Juveniele spondylitis ankylopoetica"
    ]
  },

  {
    "eng" : [
      "Ankylosing spondylitis with organ / system involvement",
      "Ankylosing spondylitis with organ / system involvement (disorder"
    ],

    "dut" : []
  },

  {
    "eng" : [
      "Ankylosing spondylitis with multisystem involvement"
    ],

    "dut" : []
  },

  {
    "eng" : [
      "Ankylosing spondylarthritis and eye lesions",
      "Gringolo's disease",
      "Gringolo's syndrome"
    ],

    "dut" : []
  }
  ];

  for (var i=0; i < cases.length; i++) {
    cases[i].eng = _.uniq(cases[i].eng, function(str) {
      return str.toLowerCase().replace('-', ' ').replace('\'s', 's');
    });

    console.log(cases[i].eng);
    console.log("Score : " + score(cases[i].eng, cases[i].dut));
    console.log();
  }
};

