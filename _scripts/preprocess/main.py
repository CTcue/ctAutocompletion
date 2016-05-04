#!/usr/bin/env python
# -*- coding: utf-8 -*-

from mrjob.job import MRJob
from collections import defaultdict
from normalize import normalize
from semantic import get_group
from body_parts import is_bodypart
from skip_categories import skip_categories
import re
import os
import tempfile


# Set tmp dir to relative directory from script
basepath = os.path.dirname(__file__)
tmp_dir  = os.path.abspath(os.path.join(basepath, "tmp"))
tempfile.tempdir = tmp_dir


# Patterns
p_number = re.compile(r"^[0-9]+$")
p_roman  = re.compile("^M{0,4***REMOVED***(CM|CD|D?C{0,3***REMOVED***)(XC|XL|L?X{0,3***REMOVED***)(IX|IV|V?I{0,3***REMOVED***)$", flags=re.I)


class AggregatorJob(MRJob):
    """
    Groups unique terms/synonyms by CUI, for each language.
    Output format: (CUI, LANG, PREF_TERM, [TYPES], [STR, STR, ...])
    """

    def mapper(self, key, value):
        split = value.decode("utf-8").split("|")

        # MRCONSO Header
        if len(split) == 19:
            (CUI, LAT, TS, LUI, STT, SUI, ISPREF, AUI, SAUI, SCUI, SDUI, SAB, TTY, CODE, STR, SRL, SUPPRESS, CVF, _) = split

            STR = STR.strip()

            if len(STR) < 2 or len(STR) > 30:
                return

            if ISPREF != 'Y' or STT != "PF":
                return

            # Language
            if LAT not in ['ENG', 'DUT']:
                return

            # Obsolete sources
            if TTY in ['N1','PM', 'OAS','OAF','OAM','OAP','OA','OCD','OET','OF','OLC','OM','ONP','OOSN','OPN','OP','LO','IS','MTH_LO','MTH_IS','MTH_OET']:
                return

            if SAB in ["CHV","PSY","ICD9","ICD9CM","NCI_FDA","NCI_CTCAE","NCI_CDISC","ICPC2P","SNOMEDCT_VET"]:
                return

            # Skip NOS terms
            if re.match(r"(nos|NOS)$", STR):
                return

            # Skip digit(s) only terms
            if re.match(p_number, STR):
                return

            if re.match(p_roman, STR):
                return

            # Skip records such as Pat.mo.dnt
            if STR.count(".") >= 3 or STR.count(":") >= 3:
                return

            if "." in STR and "^" in STR:
                return

            if TS == "P":
                yield CUI, ["PREF", LAT, normalize(STR)]
            else:
                yield CUI, ["TERM", LAT, normalize(STR)]


        # Additional Terms header
        elif len(split) == 4:
            (CUI, STR, LAT, SAB) = split

            if LAT == "nl":
                LAT = "DUT"
            elif LAT == "en":
                LAT = "ENG"

            yield CUI, ["PREF", LAT, STR]

        # MRSTY Header
        elif len(split) == 7:
            (CUI, TUI, STN, STY, ATUI, CVF, _) = split

            # Skipabble categories
            if STY in skip_categories:
                return

            yield CUI, ["STY", get_group(TUI)]
        else:
            pass


    def reducer(self, key, values):
        terms = defaultdict(set)
        preferred = defaultdict(list)
        types = set()

        for value in values:
            if value[0] == "TERM":
                terms[value[1]].add(value[2])

            if value[0] == "PREF":
                preferred[value[1]].append(value[2])
                terms[value[1]].add(value[2])

            elif value[0] == "STY":
                types.add(value[1])


        # Check the types
        if not terms or not types:
            return

        if any(x for x in types if x in ["LIVB", "CONC", "ACTI", "GEOG", "OBJC", "OCCU", "DEVI", "ORGA"]):
            return

        for LAT, v in terms.iteritems():
            # If ANATOMY category -> skip checking for anatomoy terms
            if not any(x for x in types if x == "ANAT"):
                tmp_terms = set()
                for t in v:
                    if not is_bodypart(t):
                        tmp_terms.add(t)
                v = tmp_terms

            # Get unique terms per language
            unique = {t.lower(): t for t in v***REMOVED***.values()

            if LAT in preferred and len(unique):
                out = "%s\t%s\t%s\t%s\t%s" % (key, LAT, preferred[LAT][0], "|".join(types), "|".join(unique))
                print out.encode("utf-8")


if __name__ == "__main__":
    AggregatorJob.run()
