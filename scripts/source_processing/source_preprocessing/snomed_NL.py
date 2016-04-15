import source_params
from utils import read_rows
from collections import defaultdict

params = source_params.params["snomed_NL"]

def get_terms():
    terms = defaultdict(list)

    for row in read_rows(params["NL_file"], delimiter="\t"):
        if row[params["lan"]]==params["lan_nl"]:
            snomed_id = row[params["snomed_id"]]
            term = row[params["term"]]
            terms[term].append({"source_id":snomed_id,"lan":"nl"***REMOVED***)


    return terms
