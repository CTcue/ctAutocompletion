from utils import read_rrf, read_rows
import unicodecsv as csv
from tqdm import *
from collections import defaultdict

rel_header_farmacoconcepts = [
        "name",
        "id",
        "parent"
        ]

rel_header_farmacoterms = [
        "cuis",
        "term",
        "parents"
        ]


rel_header = [
    "CUI1",
    "AUI1",
    "STYPE1",
    "REL",
    "CUI2",
    "AUI2",
    "STYPE2",
    "RELA",
    "RUI",
    "SRUI",
    "SAB",
    "SL",
    "RG",
    "DIR",
    "SUPPRESS",
    "CVF"
]

def get_CUIS():
    types = set()
    cuis = defaultdict(lambda:{"types":[],"added":False***REMOVED***)


    for r in tqdm(read_rows("relations/data/used_CUIs.csv",delimiter="|", header=["CUI","term","types"], replace_header=True)):
        cur_types = [ct for ct in r["types"].split(";") if ct !='']
        types.update(cur_types)
        cuis[r["CUI"]]["types"].extend(cur_types)


    with open("relations/data/concept_types.csv","wb") as outf:
        w =  csv.writer(outf, encoding="utf-8",delimiter = "|")
        for t in types:
            w.writerow([t])

    return cuis


def canSkip(row, used_CUIs):

    if row["CUI1"]=="" or row["CUI2"]=="":
        return True

    if row["SAB"] not in ["SNOMEDCT_US", "ICD10CM"]:
        return True

    if row["RELA"] in ["","inverse_isa","has_expanded_form"]:
        return True

    if row["CUI1"] in used_CUIs and row["CUI2"] in used_CUIs:
        return False

    return True



