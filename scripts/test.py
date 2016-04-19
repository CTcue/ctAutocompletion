import unittest
import utils


class TestStringMethods(unittest.TestCase):

    def test_semicolon(self):
        self.assertEqual(utils.normalize("Abdomen; swollen"), "Abdomen swollen")
        self.assertEqual(utils.normalize("Test;Ziekte"), "Test Ziekte")

    def test_comma(self):
        self.assertEqual(utils.normalize("Abdomen, swollen"), "Abdomen, swollen")

    def test_sub(self):
        self.assertEqual(utils.normalize("24,25-Dihydroxyvitamin D>3<"), "24,25-Dihydroxyvitamin D3")
        self.assertEqual(utils.normalize("24,25-Dihydroxyvitamin D<sup>2</sup>"), "24,25-Dihydroxyvitamin D2")

        self.assertEqual(utils.normalize("Test (NADP^+^)"), "Test (NADP+)")
        self.assertEqual(utils.normalize("Breast--Fibrocystic disease"), "Breast-Fibrocystic disease")

    def test_full_caps(self):
        self.assertEqual(utils.normalize("ABRACAD 1"), "abracad 1")

    def test_indicator(self):
        self.assertEqual(utils.normalize("dadada (event)"), "dadada")
        self.assertEqual(utils.normalize("17-Ketosteroid (substance)"), "17-Ketosteroid")
        self.assertEqual(utils.normalize("Droxidopa [Chemical/Ingredient]"), "Droxidopa")
        self.assertEqual(utils.normalize("Abdomen, Acute [Disease/Finding]"), "Abdomen, Acute")

        self.assertEqual(utils.normalize("Sicca-Syndrome [Sjogren]I"), "Sicca-Syndrome I")

    def test_machine_variants(self):
        self.assertEqual(utils.normalize("Tumor, Buik-"), "buiktumor")
        self.assertEqual(utils.normalize("Syndroom, afferente-lis-"), "afferente-lissyndroom")
        self.assertEqual(utils.normalize("Virus, Aviair adeno-"), "aviair adenovirus")

        self.assertEqual(utils.normalize("123-diactiel, test-"), "123-diactiel, test-")

    def test_self_abbr(self):
        self.assertEqual(utils.normalize("AS - Ankylosing spondy"), "Ankylosing spondy")

    def test_remove_nao(self):
        self.assertEqual(utils.normalize("Gezwel nao"), "Gezwel")
        self.assertEqual(utils.normalize("Gezwel NAO"), "Gezwel")

        self.assertEqual(utils.normalize("Gezwel NAO, unspecified"), "Gezwel NAO")

    def test_remove_common(self):
        self.assertEqual(utils.normalize("Bechterew, ziekte van"), "Bechterew")
        self.assertEqual(utils.normalize("Bechterew, Syndroom van"), "Bechterew")


    def test_check_row(self):
        row = {
            "STR": "Hypertension NOS",
            "ISPREF": "Y",
            "LAT": "ENG",
            "TTY": "ZZZ"
    ***REMOVED***

        self.assertEqual(utils.check_row(row), False)


if __name__ == '__main__':
    unittest.main()
