#!/usr/bin/env python
# -*- coding: utf-8 -*-
import argparse
import csv
import re
import os

basepath = os.path.dirname(__file__)

useless_relations = [
    "inverse_isa",
    "has_expanded_form",
    "was_a",
    "mapped_to",
    "mapped_from"
]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pre-process build relations")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    args = parser.parse_args()

    # First load used CUI's
    usedCUI = set()

    with open(os.path.join(basepath, "..", "output", "concepts.txt")) as t:
        datareader = csv.reader(t, delimiter=str("\t"))
        for line in datareader:
            (CUI, LAT, PREF, CODE, TERMS) = line
            usedCUI.add(CUI)


    with open(os.path.join(basepath, "..", args.dir, "MRREL.RRF")) as t:
        datareader = csv.reader(t, delimiter=str("|"))
        for line in datareader:
            (CUI1, AUI1, STYPE1, REL, CUI2, AUI2, STYPE2, RELA, RUI, SRUI, SAB, SL, RG, DIR, SUPPRESS, CVF, _) = line

            if not SAB or SAB not in ["SNOMEDCT_US", "ICD10CM"]:
                continue

            # ICD10 relations are defined different
            if SAB == "ICD10CM" and "REL" == "CHD":
                RELA = "is_a_ICD10"


            if CUI1 == "" or CUI2 == "" or CUI1 == CUI2:
                continue

            if not RELA or RELA in useless_relations:
                continue

            if not CUI1 in usedCUI:
                continue

            if not CUI2 in usedCUI:
                continue

            print "%s\t%s\t%s" % (CUI1, RELA, CUI2)

