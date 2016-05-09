#!/usr/bin/env python
# -*- coding: utf-8 -*-
import argparse
import csv
import re
import os

basepath = os.path.dirname(__file__)

# useless_relations = [
#     "inverse_isa",
#     "has_expanded_form",
#     "was_a",
#     "mapped_to",
#     "mapped_from",
#     "replaces",
#     "replaced_by",
#     "same_as",

#     "uses_energy",
#     "energy_used_by",
#     "temporally_followed_by",
#     "temporally_follows"
# ]

# usable_relations = [
#     "isa"
# ]


# Relations defined
# https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/abbreviations.html#REL

# AQ  Allowed qualifier
# CHD has child relationship in a Metathesaurus source vocabulary
# DEL Deleted concept
# PAR has parent relationship in a Metathesaurus source vocabulary
# QB  can be qualified by.
# RB  has a broader relationship
# RL  the relationship is similar or "alike". the two concepts are similar or "alike". In the current edition of the Metathesaurus, most relationships with this attribute are mappings provided by a source, named in SAB and SL; hence concepts linked by this relationship may be synonymous, i.e. self-referential: CUI1 = CUI2. In previous releases, some MeSH Supplementary Concept relationships were represented in this way.
# RN  has a narrower relationship
# RO  has relationship other than synonymous, narrower, or broader
# RQ  related and possibly synonymous.
# RU  Related, unspecified
# SIB has sibling relationship in a Metathesaurus source vocabulary.
# SY  source asserted synonymy.
# XR  Not related, no mapping
#     Empty relationship


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pre-process build relations")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    args = parser.parse_args()

    # First load used CUI's
    usedCUI = set()

    with open(os.path.join(basepath, "..", "output", "concepts.txt")) as t:
        datareader = csv.reader(t, delimiter=str("\t"))
        for line in datareader:
            (CUI, LAT, SAB, CODE, PREF, TERMS) = line
            usedCUI.add(CUI)


    with open(os.path.join(basepath, "..", args.dir, "MRREL.RRF")) as t:
        datareader = csv.reader(t, delimiter=str("|"))
        for line in datareader:
            (CUI1, AUI1, STYPE1, REL, CUI2, AUI2, STYPE2, RELA, RUI, SRUI, SAB, SL, RG, DIR, SUPPRESS, CVF, _) = line

            if not SAB or SAB not in ["SNOMEDCT_US", "ICD10CM"]:
                continue

            # ICD10 relations are defined different
            # if SAB == "ICD10CM" and "REL" == "CHD":
            #     RELA = "is_a_ICD10"

            if CUI1 == "" or CUI2 == "" or CUI1 == CUI2:
                continue

            # if not RELA or RELA in not in usable_relations:
            #     continue

            # if REL not in ["CHD", "SIB"]:
            #     continue

            if not CUI1 in usedCUI:
                continue

            if not CUI2 in usedCUI:
                continue

            if REL == "CHD":
                relation = "is_child"
            elif REL == "SIB":
                relation = "is_sibling"
            else:
                relation = REL + ":" + RELA

            print "%s\t%s\t%s" % (CUI2, relation, CUI1)

