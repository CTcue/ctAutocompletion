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

block_cat = [
    "ambiguous",
    "Chemical/Ingredient",
    "Disease/Finding"
]

_cats = re.compile("\((%s)\)" % "|".join(bracket_cat))
_combined = re.compile("(\[(%s)\]|\((%s)\))" % ("|".join(block_cat), "|".join(bracket_cat)))

endsWith = [
    "NAO",
    "\(NAO\)",
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
    term = term.replace(";", " ")
    term = term.replace("'''", "'")
    term = term.replace("^+^", "+")
    term = re.sub(r"-+", "-", term)
    term = re.sub(r"(<su[bp])?>([a-zA-Z0-9]+)<(/su[bp]>)?", r"\2", term)
    term = re.sub(_combined, "", term)

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
        if re.match(r"[A-Z]{1,6} - .*", term, flags=re.U):
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


if __name__ == '__main__':
    import unittest

    class TestStringMethods(unittest.TestCase):

        def test_semicolon(self):
            self.assertEqual(normalize("Abdomen; swollen"), "Abdomen swollen")
            self.assertEqual(normalize("Test;Ziekte"), "Test Ziekte")

        def test_comma(self):
            self.assertEqual(normalize("Abdomen, swollen"), "Abdomen, swollen")

        def test_sub(self):
            self.assertEqual(normalize("24,25-Dihydroxyvitamin D>3<"), "24,25-Dihydroxyvitamin D3")
            self.assertEqual(normalize("24,25-Dihydroxyvitamin D<sup>2</sup>"), "24,25-Dihydroxyvitamin D2")

            self.assertEqual(normalize("Test (NADP^+^)"), "Test (NADP+)")
            self.assertEqual(normalize("Breast--Fibrocystic disease"), "Breast-Fibrocystic disease")

        def test_full_caps(self):
            self.assertEqual(normalize("ABRACAD 1"), "abracad 1")

        def test_indicator(self):
            self.assertEqual(normalize("dadada (event)"), "dadada")
            self.assertEqual(normalize("dadada (disorder) "), "dadada")
            self.assertEqual(normalize("Phenindione 25mg tablet (product)"), "Phenindione 25mg tablet")
            self.assertEqual(normalize("17-Ketosteroid (substance)"), "17-Ketosteroid")
            self.assertEqual(normalize("Droxidopa [Chemical/Ingredient]"), "Droxidopa")
            self.assertEqual(normalize("Abdomen, Acute [Disease/Finding]"), "Abdomen, Acute")

        def test_machine_variants(self):
            self.assertEqual(normalize("Tumor, Buik-"), "buiktumor")
            self.assertEqual(normalize("Syndroom, afferente-lis-"), "afferente-lissyndroom")
            self.assertEqual(normalize("Virus, Aviair adeno-"), "aviair adenovirus")

            self.assertEqual(normalize("123-diactiel, test-"), "123-diactiel, test-")

        def test_self_abbr(self):
            self.assertEqual(normalize("AS - Ankylosing spondy"), "Ankylosing spondy")

        def test_remove_nao(self):
            self.assertEqual(normalize("Gezwel nao"), "Gezwel")
            self.assertEqual(normalize("Gezwel NAO"), "Gezwel")
            self.assertEqual(normalize("Gezwel NAO, unspecified"), "Gezwel NAO")

        def test_remove_common(self):
            self.assertEqual(normalize("Bechterew, ziekte van"), "Bechterew")
            self.assertEqual(normalize("Bechterew, Syndroom van"), "Bechterew")

    unittest.main()
