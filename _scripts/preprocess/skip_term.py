from collections import Counter
import re

p_nos = re.compile(r"\b(nos|NOS|induced platelet Ab)\b")
p_dosage = re.compile(r"\b([0-9\.]+ (mg|MG|\w+/ML))\b")
p_meds = re.compile(r".\boral (\w+)? (capsule|product|pill)\b", flags=re.I)
p_construct1 = re.compile(r"\b(skin|tissue) structure of\b", flags=re.I)
p_construct2 = re.compile(r"\b(fracture|structure) of\b.*of\b", flags=re.I)


def skip_term(STR):
    if len(STR) < 2 or len(STR) > 80:
        return True

    # To skip chemical notation and records such as Pat.mo.dnt
    # - Count specific characters
    chars = Counter()
    for c in STR:
        if c.isdigit():
            chars["digits"] += 1
        elif c.isalpha():
            chars["letters"] += 1
        else:
            chars[c] += 1

    if chars["letters"] < 2:
        return True

    # Skip records with a lot of words
    if chars[" "] > 7:
        return True

    if chars["digits"] >= 2:
        if chars["-"] >= 2:
            return True
        if chars["("] >= 1:
            return True

    if chars["digits"] > 3 and (chars[","] or chars["'"]):
        return True

    if chars["."] >= 3:
        return True
    if chars[":"] >= 3:
        return True
    if chars["@"] >= 2:
        return True
    if chars["("] >= 2:
        return True
    if chars["["] >= 2:
        return True
    if chars[","] > 2 and chars["-"] > 2:
        return True
    if chars["-"] > 4:
        return True

    if "." in STR:
        if "^" in STR:
            return True
        if "'" in STR and "," in STR:
            return True

    # Skip NOS terms
    if re.search(p_nos, STR):
        return True

    # Skip medication with dosage info (Phenindione 10mg tablet)
    if re.search(p_dosage, STR):
        return True
    if re.search(p_meds, STR):
        return True

    # Skip terms with weird constructs (X structure of Y)
    if re.search(p_construct1, STR) or re.search(p_construct2, STR):
        return True

    return False


if __name__ == '__main__':
    import unittest

    class TestTerms(unittest.TestCase):
        def test_normal(self):
            self.assertEqual(skip_term("LDL"), False)
            self.assertEqual(skip_term("Carcinoma"), False)
            self.assertEqual(skip_term("Ankylosing spondylitis"), False)
            self.assertEqual(skip_term("Recurrent Major depressive disorder"), False)
            self.assertEqual(skip_term("Simvastatine"), False)
            self.assertEqual(skip_term("Malignant neoplasm, Brain"), False)
            self.assertEqual(skip_term("Structure of occipital angle"), False)

        def test_nubmer(self):
            self.assertEqual(skip_term("11"), True)
            self.assertEqual(skip_term("0.11"), True)
            self.assertEqual(skip_term("20.11"), True)
            self.assertEqual(skip_term("20-11"), True)

        def test_NOS(self):
            self.assertEqual(skip_term("pernoster"), False)
            self.assertEqual(skip_term("pernosterNOS"), False)
            self.assertEqual(skip_term("Abdomen NOS"), True)

        def test_long(self):
            self.assertEqual(skip_term("Injury leading to death associated with"), False)
            self.assertEqual(skip_term("I feel that I am disappointing other people at work in the past 7D"), True)

        def test_chemical(self):
            self.assertEqual(skip_term("22.5-51-26.5 acrylic acid-acrylamide-dadmac"), True)
            self.assertEqual(skip_term("2-morpholino-5-(thienyl-2)-6-H-1,3,4-thiadiazine"), True)
            self.assertEqual(skip_term("3a.7a',7a.3a'-dihydroxyligustilide"), True)
            self.assertEqual(skip_term("2-(4-hydroxyanilino)-1,4-naphthoquinone"), True)
            self.assertEqual(skip_term("1,1-dimethyl-2-phenylethyl isobutyrate"), True)

        def test_medication_dosage(self):
            self.assertEqual(skip_term("Afatinib 40"), False)
            self.assertEqual(skip_term("Afatinib 40 MG"), True)
            self.assertEqual(skip_term("Sodium Fluoride 0.0024 MG/MG"), True)
            self.assertEqual(skip_term("golimumab 12.5 MG/ML"), True)
            self.assertEqual(skip_term("Bacitracin 0.5 UNT/ML"), True)
            self.assertEqual(skip_term("Tacrolimus 1 MG Extended Release Oral Capsule"), True)

        def test_medication_form(self):
            self.assertEqual(skip_term("Oral Paste Product"), False)
            self.assertEqual(skip_term("Biotene Dry Mouth Fluoride Oral Paste Product"), True)
            self.assertEqual(skip_term("Pediacare Children's 24-Hr Allergy Oral Liquid Product"), True)
            self.assertEqual(skip_term("levomilnacipran 120 MG Extended Release Oral Capsule"), True)

        def test_multi_term(self):
            # Ezetimibe+Simvastatin
            # self.assertEqual(skip_term("Piperonyl Butoxide / Pyrethrins Medicated Shampoo"), True)
            pass

        def test_constructs(self):
            self.assertEqual(skip_term("Skin structure of labium"), True)
            self.assertEqual(skip_term("Subcutaneous tissue structure of head"), True)
            self.assertEqual(skip_term("Mirtazapine induced platelet Ab"), True)

    unittest.main()
