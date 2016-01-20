#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unicodecsv as csv
import argparse
import utils
import time
import json
import os
import re

allowed_types = [
    # "Organic Chemical",
    "Pharmacologic Substance",
    # "Amino Acid, Peptide, or Protein",
    "Sign or Symptom",
    "Antibiotic",
    # "Finding",
    "Laboratory or Test Result"
    "Virus",
    "Disease or Syndrome",
    # "Immunologic Factor"
]

sources = ["MSH", "SNOMEDCT_US", "ICD10CM", "MSHDUT", "LNC215"]


def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


def is_chemical_notation(text):
    if not text:
        return True

    return len(text) > 30 or sum( (c.isdigit() or c == "(") for c in text ) > 3

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion neo4j upload")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    args = parser.parse_args()


    print "[%s]  Start" % stamp()

    with open("concepts.csv", "wb") as f_out:
        writer = csv.writer(f_out, delimiter=str(','), quoting=csv.QUOTE_MINIMAL)
        writer.writerow(["cui:ID(Concept)","pref"])

        for (cui, conso, types, preferred), (scui, sty) in utils.merged_rows(args.dir):
            if is_chemical_notation(preferred):
                continue

            if not any(s in allowed_types for s in sty):
                continue

            writer.writerow([cui, preferred])


    # with open("relations.csv", "wb") as f_out:
    #     writer = csv.writer(f_out, delimiter=str(','), quoting=csv.QUOTE_MINIMAL)

    #     writer.writerow([":START_ID(Concept)",":END_ID(Concept)"])
    #     for row in read_rel(args.dir):
    #         if row["CUI1"] == row["CUI2"]:
    #             continue

    #         writer.writerow([row["CUI2"], row["CUI1"]])

    print "[%s]  Done" % stamp()
