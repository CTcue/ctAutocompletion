# -*- coding: utf-8 -*-
import re

_digits = re.compile('\d')

bracket_cat = [
    "activity",
    "acute",
    "acuut",
    "all forms",
    "antepartum",
    "body structure",
    "cell",
    "commercial",
    "device",
    "diagnosis",
    "disorder",
    "etiology",
    "event",
    "finding",
    "function",
    "fungus",
    "history",
    "mass",
    "massa",
    "medication",
    "observable entity",
    "occupation",
    "organism",
    "physical finding",
    "physical force",
    "procedure",
    "product",
    "qualifier value"
    "situation",
    "structure",
    "substance",
    "symptom",
    "treatment",
    "volume",
]
_cats = re.compile( "\((%s)\)" % "|".join(bracket_cat) )

block_cat = [
    "ambiguous",
    "Chemical/Ingredient",
    "Disease/Finding"
]

_combined = re.compile("(\[(%s)\]|\((%s)\))" % ("|".join(block_cat), "|".join(bracket_cat)))

endsWith = [
    "NAO",
    "\(NAO\)",
    "\(NOS\)",
    "nao",
    "[Dd]is",
    "[Zz]iekte van",
    "[Ss]yndroom van",
    "unspecified"
]
_endings = re.compile(" (%s)$" % "|".join(endsWith))


def contains_digits(d):
    return bool(_digits.search(d))


def normalize(term):
    # Multiple symbols -> become one '''

    term = term.replace(";", " ")
    term = term.replace("^+^", "+")
    term = re.sub(r"-+", "-", term)
    term = re.sub(r"(<su[bp])?>([a-zA-Z0-9]+)<(/su[bp]>)?", r"\2", term)
    term = re.sub(_cats, "", term)

    # Clean between brackets
    term = re.sub("(\[.*\])", "", term)

    # Remove specific terms at term endings
    term = re.sub(_endings, "", term)

    # Reduce multiple spaces to single
    term = re.sub('\s+', ' ', term)

    # If entire term is uppercased, skip checking for abbreviations
    if term.isupper():
        term = term.lower()
    else:
        # Some terms contain their own abbreviation
        # i.e. AS - Ankylosing spondylitis
        if re.match(r"[A-Z]{1,6***REMOVED*** - .*", term, flags=re.U):
            split = term.split(" - ", 1)
            term = split[1]

    # Skip things with digits, probably a scienctific notation
    if contains_digits(term):
        return term.strip()

    # Using "PF preferred terms" most machine variants
    # (i.e. First last is notated as Last, First)
    # However, the dutch terms are all labeled as PF?
    term, n = re.subn(r"(\w+), ([a-zA-Z- ]+)-$", r"\2\1", term, flags=re.U)

    # If replacements made, also lowercase it or you get Tumor, Buik- => BuikTumor
    if n > 0:
        term = term.lower()

    return term.strip(" ,-")