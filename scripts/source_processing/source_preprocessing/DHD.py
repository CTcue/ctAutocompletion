import source_params
from utils import read_rows
from collections import defaultdict

params = source_params.params["DHD"]


def get_terms():
    terms = defaultdict(list)

    mapping = defaultdict(list)
    for r in read_rows(params["mapping_file"],delimiter=","):
        mapping[r[params["source_id"]]].append(r[params["snomed_id"]])


    for r in read_rows(params["NL_file"], delimiter=","):
        for s_id in mapping[r[params["source_id"]]]:
            elem = {"source_id":s_id,"lan":"nl"}
            terms[r[params["term"]]].append(elem)

    return terms


