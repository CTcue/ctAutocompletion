from collections import defaultdict
from utils import read_rows
import source_params
import codecs
import re

params = source_params.params["GGL_translate"]


def get_terms():
    mappings = defaultdict(list)
    terms = defaultdict(list)

    for row in read_rows(params["term_file"]):
        snomed_id = row["snomed_id"]
        term = adapt_term(row["term"])

        if term != row["term"]:
            print term, "-", row["term"]

        if "AND" in snomed_id:
            temp = snomed_id.split("AND")
            for t in temp:
                terms[term].append({"source_id":t,"lan":"nl"})
        else:
            mappings[snomed_id].append(snomed_id)
            terms[term].append({"source_id":snomed_id,"lan":"nl"})

    return terms


def adapt_term(t):
    t = re.sub("^(.+)structuur$",r"\1",t)
    t = re.sub("^structuur van (.+)$",r"\1",t)
    return t

