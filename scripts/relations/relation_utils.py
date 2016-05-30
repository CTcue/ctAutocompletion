from utils import read_rrf, read_rows
import unicodecsv as csv
from tqdm import *
from collections import defaultdict
import re

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

def get_CUIS(neo4jstyle=True):
    types = set()
    cuis = defaultdict(lambda:{"types":[],"added":False})


    for r in tqdm(read_rows("relations/data/used_CUIs.csv",delimiter="|", header=["CUI","term","types"], replace_header=True)):
        cur_types = [ct for ct in r["types"].split(";") if ct !='']
        cur_types = [re.sub("[,\\/]", "", t) for t in cur_types]
        types.update(cur_types)
        cuis[r["CUI"]]["types"].extend(cur_types)
        cuis[r["CUI"]]["term"]=r["term"]

    if neo4jstyle:

        with open("relations/data/concept_types.csv","wb") as outf:
            w =  csv.writer(outf, encoding="utf-8",delimiter = "|")
            w.writerow(["Type:ID(Concept_Type)"])
            for t in types:
                w.writerow([t])

        rel_overview = set()
        with open("relations/data/umls_concepts.csv","wb") as outf:
            with open("relations/data/rels_concept_type.csv","wb") as outf_rel:

                w =  csv.writer(outf, encoding="utf-8",delimiter = "|")
                w.writerow(["cui:ID(Concept)","term"])

                wrel = csv.writer(outf_rel, encoding="utf-8",delimiter = "|")
                wrel.writerow([":START_ID(Concept)",":END_ID(Concept_Type)",":TYPE"])

                for cui in cuis:
                    w.writerow([cui,cuis[cui]["term"]])
                    for t in cuis[cui]["types"]:
                        wrel.writerow([cui, t, "of_type"])
                        rel_overview.add(t)

        with open("relations/data/overview_concept_types.csv","wb") as outf:
            w =  csv.writer(outf, encoding="utf-8",delimiter = ",")
            w.writerow(["rel_type","rel_source"])
            for r in rel_overview:
                w.writerow([r])


        return set(cuis.keys())

    return cuis

useless_relations = ["inverse_isa","has_expanded_form",
                    "was_a", "mapped_to", "mapped_from"]
def canSkip(row, used_CUIs):

    if row["SAB"] not in ["SNOMEDCT_US", "ICD10CM"]:
        return True


    if row["CUI1"]=="" or row["CUI2"]=="":
        return True

    if row["CUI1"] == row["CUI2"]:
        return True


    if row["RELA"] in useless_relations:
        return True

    if row["SAB"] == "" and row["SAB"]!="ICD10CM":
        return True

    if row["SAB"]=="ICD10CM":
        if row["REL"] == "CHD":
            row["RELA"]="is_a_ICD10"
        else:
            return True

    if row["CUI1"] in used_CUIs and row["CUI2"] in used_CUIs:
        return False

    return True



