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

    # def test_swollen_joint(self):
        # conso_group = [
        #     {u'TTY': u'LT', u'SAB': u'MDRDUT', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'gewrichtszwelling', u'LAT': u'DUT'***REMOVED***,
        #     {u'TTY': u'PT', u'SAB': u'MDRDUT', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'gewrichtszwelling', u'LAT': u'DUT'***REMOVED***,
        #     {u'TTY': u'LT', u'SAB': u'MDRDUT', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'gezwollen gewricht', u'LAT': u'DUT'***REMOVED***,
        #     {u'TTY': u'LT', u'SAB': u'MDRDUT', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'gezwollen gewrichten', u'LAT': u'DUT'***REMOVED***,
        #     {u'TTY': u'LT', u'SAB': u'MDR', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'Joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PT', u'SAB': u'MDR', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'Joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PTCS', u'SAB': u'OMIM', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'Joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'OAP', u'SAB': u'SNOMEDCT_US', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'Joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'OAP', u'SAB': u'SNOMEDCT_US', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'Joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'OF', u'SAB': u'SNOMEDCT_US', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'Joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'OF', u'SAB': u'SNOMEDCT_US', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'Joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PT', u'SAB': u'SNOMEDCT_US', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'Joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'SY', u'SAB': u'NCI_FDA', u'TS': u'P', u'STT': u'VCW', u'ISPREF': u'Y', u'STR': u'SWELLING, JOINT', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'SY', u'SAB': u'CHV', u'TS': u'P', u'STT': u'VCW', u'ISPREF': u'Y', u'STR': u'swelling joint', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PT', u'SAB': u'NCI_FDA', u'TS': u'P', u'STT': u'VC', u'ISPREF': u'Y', u'STR': u'JOINT SWELLING', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PT', u'SAB': u'CHV', u'TS': u'P', u'STT': u'VC', u'ISPREF': u'Y', u'STR': u'joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PT', u'SAB': u'NCI', u'TS': u'P', u'STT': u'VC', u'ISPREF': u'Y', u'STR': u'Joint Swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'LT', u'SAB': u'MDR', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'N', u'STR': u'Swollen joint', u'LAT': u'ENG'***REMOVED***,

        #     {u'TTY': u'SY', u'SAB': u'SNOMEDCT_US', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'Y', u'STR': u'Swollen joint', u'LAT': u'ENG'***REMOVED***,

        #     {u'TTY': u'SY', u'SAB': u'CHV', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'Y', u'STR': u'joints swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'SY', u'SAB': u'CHV', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'Y', u'STR': u'joints swollen', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'SY', u'SAB': u'CHV', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'Y', u'STR': u'swell joint', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'SY', u'SAB': u'CHV', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'Y', u'STR': u'swollen joint', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PTCS', u'SAB': u'OMIM', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'N', u'STR': u'Swollen joints', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'LT', u'SAB': u'MDR', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'Y', u'STR': u'Swollen joints', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PT', u'SAB': u'ICPC2P', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'Y', u'STR': u'Swollen;joint(s)', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'SY', u'SAB': u'CHV', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'N', u'STR': u'swollen joints', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PTN', u'SAB': u'ICPC2P', u'TS': u'P', u'STT': u'VO', u'ISPREF': u'Y', u'STR': u'swollen joints', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'SY', u'SAB': u'SNOMEDCT_US', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'Observation of joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'ET', u'SAB': u'MTHICD9', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'Swelling of joint with or without pain', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'OAF', u'SAB': u'SNOMEDCT_US', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'Finding of joint swelling (finding)', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'OAF', u'SAB': u'SNOMEDCT_US', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'Joint swelling (finding)', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'OAF', u'SAB': u'SNOMEDCT_US', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'N', u'STR': u'Joint swelling (finding)', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'FN', u'SAB': u'SNOMEDCT_US', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'Joint swelling (finding)', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'OAP', u'SAB': u'SNOMEDCT_US', u'TS': u'S', u'STT': u'VO', u'ISPREF': u'Y', u'STR': u'Finding of joint swelling', u'LAT': u'ENG'***REMOVED***,
        #     {u'TTY': u'PT', u'SAB': u'SCTSPA', u'TS': u'P', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'tumefacci\xf3n articular', u'LAT': u'SPA'***REMOVED***,
        #     {u'TTY': u'FN', u'SAB': u'SCTSPA', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'tumefacci\xf3n articular (hallazgo)', u'LAT': u'SPA'***REMOVED***,
        #     {u'TTY': u'OAP', u'SAB': u'SCTSPA', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'tumefacci\xf3n articular-hallazgo', u'LAT': u'SPA'***REMOVED***,
        #     {u'TTY': u'OAF', u'SAB': u'SCTSPA', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'tumefacci\xf3n articular-hallazgo (hallazgo)', u'LAT': u'SPA'***REMOVED***,
        #     {u'TTY': u'OAS', u'SAB': u'SCTSPA', u'TS': u'S', u'STT': u'PF', u'ISPREF': u'Y', u'STR': u'tumefacci\xf3n de la articulaci\xf3n-hallazgo', u'LAT': u'SPA'***REMOVED***
        # ]

        # [{u'SAB': u'MDRDUT', u'TTY': u'PT', u'TS': u'P', u'STR': u'gewrichtszwelling', u'normal': u'gewrichtszwelling'***REMOVED***, {u'SAB': u'MDRDUT', u'TTY': u'LT', u'TS': u'S', u'STR': u'gezwollen gewricht', u'normal
        # ': u'gezwollen gewricht'***REMOVED***, {u'SAB': u'MDRDUT', u'TTY': u'LT', u'TS': u'S', u'STR': u'gezwollen gewrichten', u'normal': u'gezwollen gewrichten'***REMOVED***, {u'SAB': u'SNOMEDCT_US', u'TTY': u'PT', u'TS': u'P', u'
        # STR': u'Joint swelling', u'normal': u'Joint swelling'***REMOVED***, {u'SAB': u'SNOMEDCT_US', u'TTY': u'SY', u'TS': u'S', u'STR': u'Observation of joint swelling', u'normal': u'Observation of joint swelling'***REMOVED***, {u'
        # SAB': u'SNOMEDCT_US', u'TTY': u'FN', u'TS': u'S', u'STR': u'Joint swelling (finding)', u'normal': u'Joint swelling'***REMOVED***]

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
