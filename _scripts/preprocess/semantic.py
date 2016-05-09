# -*- coding: utf-8 -*-
import unicodecsv as csv
import os


semantic_types = {}
basepath = os.path.dirname(__file__)

with open(os.path.join(basepath, "lookup_data", "semantic_types.txt")) as t:
    datareader = csv.reader(t, encoding="utf-8", delimiter=str("|"))
    for line in datareader:
        (abbr, group, code, description) = line
        semantic_types[code] = abbr


def get_group(code):
    if code in semantic_types:
        return semantic_types[code]

    return ""