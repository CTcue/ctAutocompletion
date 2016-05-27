import re

# Patterns
p_number = re.compile(r"^[0-9\.]+$")


def skip_term(STR):
    if len(STR) < 2 or len(STR) > 80:
        return True

    # Skip NOS terms
    if re.search(r"\b(nos|NOS)\b", STR):
        return True

    # # Skip digit(s) only terms
    if re.match(p_number, STR):
        return True

    # Skip records with a lot of words
    if len(re.findall(r'\w+', STR)) > 6:
        return True

    # Skip records such as Pat.mo.dnt and chemical notations
    if "." in STR and "^" in STR:
        return True

    if STR.count(".") >= 3 or STR.count(":") >= 3:
        return True

    if STR.count("(") >= 2 or STR.count("[") >= 2:
        return True

    if STR.count(",") > 2 and STR.count("-") > 2:
        return True

    if STR.count("-") > 4:
        return True

    # Skip medication with dosage info (Phenindione 10mg tablet)

    return False



if __name__ == '__main__':
    import unittest

    class TestTerms(unittest.TestCase):

        def test_nubmer(self):
            self.assertEqual(skip_term("carcinoma 11"), False)
            self.assertEqual(skip_term("11"), True)
            self.assertEqual(skip_term("0.11"), True)
            self.assertEqual(skip_term("20.11"), True)
            self.assertEqual(skip_term("20-11"), False)

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
            # Afatinib 40 MG
            # Sodium Fluoride 0.0024 MG/MG
            # golimumab 12.5 MG/ML
            # Bacitracin 0.5 UNT/ML
            # Tacrolimus 1 MG Extended Release Oral Capsule
            pass

        def test_medication_form(self):
            # Biotene Dry Mouth Fluoride Oral Paste Product
            # Pediacare Children's 24-Hr Allergy Oral Liquid Product
            # levomilnacipran 120 MG Extended Release Oral Capsule
            pass

        def test_multi_term(self):
            # Piperonyl Butoxide / Pyrethrins Medicated Shampoo

            pass

        def test_computer_abbr(self):
            # Hydralazine (plat) IgM SerPl Ql FC
            # Hydralazine (plat) IgG SerPl Ql FC
            pass

        def test_constructs(self):
            # C3656166    Mirtazapine induced platelet Ab
            # C3656169    Minoxidil induced platelet Ab
            # C3656172    Minocycline induced platelet Ab
            # C3656174    Milrinone induced platelet Ab
            # C3656177    Midazolam induced platelet Ab
            # C3656180    Metronidazole induced platelet Ab
            # C3656183    Metoprolol induced platelet Ab
            # C3656186    Metoprolol induced neutrophil Ab
            # C3656189    Metoclopramide induced platelet Ab
            # C3656191    Metoclopramide induced neutrophil Ab

            pass

    unittest.main()
