# -*- coding: utf-8 -*-
import unicodecsv as csv
import os
import re


body_parts = set()
basepath = os.path.dirname(__file__)

with open(os.path.join(basepath, "lookup_data", "anatomic_data.txt")) as t:
    datareader = csv.reader(t, encoding="utf-8", delimiter=str("\t"))
    for line in datareader:
        (CUI, LAT, PREF, CODE, TERMS) = line

        split_terms = TERMS.split("|")

        for t in split_terms:
            if len(t) > 2 and re.match(r"\w+$", t.strip(" ")):
                body_parts.add(t.strip(" ").lower())


def is_bodypart(term):
    return term.lower() in body_parts