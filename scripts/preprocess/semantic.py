# -*- coding: utf-8 -*-
import os
import csv


semantic_types = {}
basepath = os.path.dirname(__file__)

with open(os.path.join(basepath, "lookup_data", "semantic_types.txt")) as t:
    datareader = csv.reader(t, delimiter=str("|"))
    for line in datareader:
        (abbr, group, code, description) = line
        semantic_types[code] = abbr

def get_group(code):
    if code in semantic_types:
        return semantic_types[code]

    return False
