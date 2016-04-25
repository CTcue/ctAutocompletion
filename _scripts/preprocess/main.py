#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from mrjob.job import MRJob

skip_categories = [
    "Age Group",
    "Temporal Concept",
    "Organism Attribute",
    "Intellectual Product",
    "Food",
    "Plant",
    "Mammal",
    "Geographic Area",
    "Governmental or Regulatory Activity",
    "Health Care Related Organization",
    "Organization",
    "Patient or Disabled Group",
    "Population Group",
    "Qualitative Concept",
    "Quantitative Concept",
    "Regulation or Law",
    "Self-help or Relief Organization"
]


class AggregatorJob(MRJob):
    """
    Groups unique synonyms by CUI.
    Output format: (CUI, [STR, STR, ...])
    """

    def mapper(self, key, value):
        split = value.decode("utf-8").split("|")

        # MRCONSO Header
        if len(split) == 19:
            (CUI, LAT, TS, LUI, STT, SUI, ISPREF, AUI, SAUI, SCUI, SDUI, SAB, TTY, CODE, STR, SRL, SUPPRESS, CVF, _) = split

            if len(STR) > 32:
                return

            if ISPREF != 'Y':
                return

            # Language
            if LAT not in ['ENG', 'DUT']:
                return

            # Obsolete sources
            if TTY in ['N1','PM', 'OAS','OAF','OAM','OAP','OA','OCD','OET','OF','OLC','OM','ONP','OOSN','OPN','OP','LO','IS','MTH_LO','MTH_IS','MTH_OET']:
                return

            if SAB in ["CHV","PSY","ICD9","ICD9CM","NCI_FDA","NCI_CTCAE","NCI_CDISC","ICPC2P","SNOMEDCT_VET"]:
                return

            # Skip records such as Pat.mo.dnt
            if STR.count(".") >= 3 or STR.count(":") >= 3:
                return

            yield CUI, ["A", STR]

        # Additional Terms header
        elif len(split) == 4:
            (CUI, STR, LAT, SAB) = split

            yield CUI, ["A", STR]

        # MRSTY Header
        elif len(split) == 7:
            (CUI, TUI, STN, STY, ATUI, CVF, _) = split

            yield CUI, ["B", STY]
        else:
            pass


    def reducer(self, key, values):
        terms = set()
        types = set()

        for value in values:
            if value[0] == "A":
                terms.add(value[1])
            elif value[0] == "B":
                types.add(value[1])

        if not terms or not types:
            return

        # Check types
        if any((x for x in types if x in skip_categories)):
            return

        out = "%s\t%s\t%s" % (key, "|".join(types), "|".join(terms))
        print out.encode("utf-8")


if __name__ == "__main__":
    AggregatorJob.run()
