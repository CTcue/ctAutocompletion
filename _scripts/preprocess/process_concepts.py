#!/usr/bin/env python
# -*- coding: utf-8 -*-
from mrjob.job import MRJob
import tempfile
from collections import defaultdict
from normalize_fn import normalize
from semantic import get_group
from body_parts import is_bodypart
from skip_term import skip_term
from skip_categories import skip_categories
import os


# Set tmp dir to relative directory from script
basepath = os.path.dirname(__file__)
tmp_dir = os.path.abspath(os.path.join(basepath, "mrjob_tmp"))
tempfile.tempdir = tmp_dir


obsolete_types = ['N1', 'PM', 'OAS', 'OAF', 'OAM', 'OAP', 'OA', 'OCD', 'OET', 'OF', 'OLC', 'OM', 'ONP', 'OOSN', 'OPN', 'OP', 'LO', 'IS', 'MTH_LO', 'MTH_IS', 'MTH_OET']
useful_sources = [
    "MSH",
    "SNOMEDCT_US",
    # "LNC",
    "RXNORM",
    "MEDCIN",
    "MTH",
    "NCI",
    "ICPC2ICD10DUT",
    "MDRDUT",
    "MSHDUT",
    "MDR",
    "ICD10DUT",
    "ICD10"
]


class AggregatorJob(MRJob):
    """
    Groups unique terms/synonyms by CUI, for each language.
    Output format: (CUI, LANG, PREF_TERM, [TYPES], [STR, STR, ...])
    """

    def mapper(self, _, line):
        split = line.split("|")

        # MRCONSO Header
        if len(split) == 19:
            (CUI, LAT, TS, LUI, STT, SUI, ISPREF, AUI, SAUI, SCUI, SDUI, SAB, TTY, CODE, STR, SRL, SUPPRESS, CVF, _) = split

            norm = normalize(STR)

            if TS == "P":
                yield CUI, ["PREF", LAT, norm, SAB]
            else:
                yield CUI, ["TERM", LAT, norm, SAB]

        # Additional Terms header
        elif len(split) == 4:
            (CUI, STR, LAT, SAB) = split

            if not STR:
                return

            STR = STR.strip()
            if STR.startswith(","):
                return

            yield CUI, ["TERM", LAT, STR, SAB]

        # Custom terms header
        elif len(split) == 5:
            (CUI, STR, LAT, SAB, PREF) = split
            STR = STR.strip()

            if PREF == "Y":
                yield CUI, ["PREF", LAT, STR, SAB]
            else:
                yield CUI, ["TERM", LAT, STR, SAB]

        # Custom terms header
        elif len(split) == 6:
            (CUI, STR, LAT, SAB, PREF, TUI) = split
            STR = STR.strip()

            if PREF == "Y":
                yield CUI, ["PREF", LAT, STR, SAB]
            else:
                yield CUI, ["TERM", LAT, STR, SAB]

            if TUI and len(TUI):
                group = get_group(TUI)

                if group:
                    yield CUI, ["STY", group, TUI]

        # MRSTY Header
        elif len(split) == 7:
            (CUI, TUI, STN, STY, ATUI, CVF, _) = split

            # Skipabble categories
            if STY in skip_categories:
                return

            group = get_group(TUI)

            if group:
                yield CUI, ["STY", group, TUI]

        else:
            # Unknown file, so skip it
            pass

    def reducer(self, CUI, values):
        terms = defaultdict(lambda: defaultdict(set))
        preferred = defaultdict(list)

        category = set()
        types = set()

        for value in values:
            if value[0] == "TERM" or value[0] == "PREF":
                (LAT, STR, SAB) = value[1:]
                terms[LAT][SAB].add(STR)

                if value[0] == "PREF":
                    preferred[LAT].append(STR)

            elif value[0] == "STY":
                category.add(value[1])
                types.add(value[2])


        combined_types = [t for t in category|types if t]

        # Skip if no actual terms found
        if not terms or not combined_types:
            return


        if any(x for x in category if x in ["LIVB", "CONC", "ACTI", "GEOG", "OBJC", "OCCU", "DEVI", "ORGA"]):
            return

        for LAT, SAB_terms in terms.items():
            for SAB, v in SAB_terms.items():
                # If ANATOMY category -> skip checking for anatomy terms
                if not any(x for x in category if x == "ANAT"):
                    tmp_terms = set()
                    for t in v:
                        if not is_bodypart(t):
                            tmp_terms.add(t)
                    v = tmp_terms

                # Get unique terms per language
                unique = {t.lower(): t for t in v}.values()

                if not unique:
                    continue

                # Find preferred term
                if LAT in preferred:
                    pref_term = preferred[LAT][0]
                elif "ENG" in preferred:
                    pref_term = preferred["ENG"][0]
                else:
                    pref_term = list(unique)[0]

                out = "\t".join([CUI, LAT, SAB, "|".join(combined_types), pref_term, "|".join(unique)])
                print(out.encode("utf-8"))


if __name__ == "__main__":
    AggregatorJob.run()
