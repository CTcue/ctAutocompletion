#!/usr/bin/env python
# -*- coding: utf-8 -*-
from mrjob.job import MRJob
import tempfile
from collections import defaultdict
import csv
import os


# Set tmp dir to relative directory from script
basepath = os.path.dirname(__file__)
tmp_dir = os.path.abspath(os.path.join(basepath, "mrjob_tmp"))
tempfile.tempdir = tmp_dir


# First load used CUI's
usedCUI = defaultdict(set)

try:
    with open(os.path.join(basepath, "..", "output", "concepts.txt")) as t:
        datareader = csv.reader(t, delimiter=str("\t"))

        for line in datareader:
            (CUI, LAT, SAB, CODE, PREF, TERMS) = line
            usedCUI[CUI].add(PREF)
except:
    print "Please run `python process_concepts.py` first to generate a list of used CUI's"


class AggregatorJob(MRJob):
    """
    Obtains unique relations by CUI1 / CUI2 combinations
    Output format: (CUI1, relation, CUI2)
    """

    def mapper(self, _, line):
        split = line.decode("utf-8").split("|")

        # MRREL header
        if len(split) == 17:
            (CUI1, AUI1, STYPE1, REL, CUI2, AUI2, STYPE2, RELA, RUI, SRUI, SAB, SL, RG, DIR, SUPPRESS, CVF, _) = split

            if CUI1 == "" or CUI2 == "" or CUI1 == CUI2:
                return

            # MSH for isa relations
            # SNOMED / ICD10 for hierarchy
            if not SAB or SAB not in ["SNOMEDCT_US", "ICD10CM", "RXNORM"]:
                return

            # if REL not in ["RN", "CHD", "SIB"]:
            #     return

            # # Allow 'narrower' relations, but only `isa`
            # if REL == "RN" and RELA != "isa":
            #     return

            if not CUI1 in usedCUI:
                return

            if not CUI2 in usedCUI:
                return


            relation = None

            if REL == "CHD":
                relation = "child_of"
            elif REL == "SIB":
                relation = "sibling_of"
            elif REL == "RN" and RELA == "isa":
                relation = "isa"
            elif RELA == "tradename_of":
                relation = "brand"

            if not relation:
                return


            # Skip relations that map term => "extended" children
            pref1 = usedCUI[CUI1]  # set(["Simvastatin"])
            pref2 = usedCUI[CUI2]  # set(["Simvastatin 40 MG Oral Tablet"])

            for child in pref2:
                if any(p.lower() in child.lower() for p in pref1):
                    return


            # Create "unique-sorted" key, to remove duplicate relations
            if CUI1 > CUI2:
                key = CUI2 + CUI1
            else:
                key = CUI1 + CUI2

            yield key, [CUI1, relation, CUI2]

    def reducer(self, key, values):
        relations = defaultdict(set)

        for (CUI1, rel, CUI2) in values:
            relations[rel] = (CUI1, CUI2)

        for rel, (CUI1, CUI2) in relations.iteritems():
            out = "\t".join([CUI1, rel, CUI2])
            print out.encode("utf-8")


if __name__ == "__main__":
    AggregatorJob.run()
