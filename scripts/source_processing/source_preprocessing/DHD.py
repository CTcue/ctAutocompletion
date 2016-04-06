import source_params
from utils import read_rows
from collections import defaultdict

params = source_params.params["DHD"]


def get_terms():
    terms = defaultdict(list)

    for r in read_rows(params["NL_file"], delimiter=","):
        elem = {"source_id":r[params["source_id"]],"lan":"nl"}
        terms[r[params["term"]]].append(elem)

    return terms


