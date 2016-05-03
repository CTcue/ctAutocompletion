# -*- coding: utf-8 -*-
import unicodecsv as csv
import os

basepath = os.path.dirname(__file__)

semantic_types = {***REMOVED***
with open(os.path.join(basepath, "data", "semantic_types.txt")) as t:
    datareader = csv.reader(t, encoding="utf-8", delimiter=str("|"))
    for line in datareader:
        (abbr, group, code, description) = line
        semantic_types[code] = abbr


def get_group(code):
    if code in semantic_types:
        return semantic_types[code]

    return ""