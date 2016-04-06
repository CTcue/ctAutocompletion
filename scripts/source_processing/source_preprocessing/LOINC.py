import source_params
from utils import read_rows
from collections import defaultdict

params = source_params.params["LOINC"]


def get_terms():
    terms = defaultdict(list)

    for r in read_rows(params["NL_file"], delimiter=","):
        elem = {"source_id":r[params["NL_source_id"]],"lan":"nl"***REMOVED***
        terms[r[params["NL_pref_term"]]].append(elem)

    for r in read_rows(params["EN_file"], delimiter=","):
        source_id = r[params["EN_source_id"]]
        elem = {"source_id":source_id,"lan":"en"***REMOVED***
        terms[r[params["EN_pref_term"]]].append(elem)
        for t in params["EN_synonyms"]:
            if r[t] != "":
                for term in r[t].split(";"):
                    terms[term].append(elem)

    return terms

def get_mappings():
    mappings = defaultdict(list)

    for r in read_rows(params["mapping_file"], delimiter="\t"):
        mappings[r[params["map_source_id"]]].append(r[params["map_snomed_id"]])

    return mappings



