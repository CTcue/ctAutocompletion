from collections import defaultdict
from utils import read_rows
import source_params
import codecs
import re

params = source_params.params["GGL_translate"]


def get_terms():
    mappings = defaultdict(list)
    terms = defaultdict(list)

    for row in read_rows(params["term_file"], delimiter="|"):
        snomed_id = row["snomed_id"]
        term = adapt_term(row["term"])

        mappings[snomed_id].append(snomed_id)
        terms[term].append({"source_id":snomed_id,"lan":"nl"})

    return terms


def adapt_term(t):
    t = re.sub("^(.+)structuur$",r"\1",t)
    t = re.sub("^structuur van (.+)$",r"\1",t)
    return t.strip()

# def undo_separator():
#     import codecs
#     import unicodecsv as csv
#     fpath = "/Users/CTcue/ctcue_code/data/google_translate_snomed/google_translated_terms_with_ids.csv"
#     with open(fpath.replace(".csv","_better.csv"), "wb") as outf:
#         w = csv.writer(outf, encoding="utf-8",delimiter="|")
#         for line in codecs.open(fpath, "rb", encoding="utf-8"):
#             line = line.split(",")
#             line = [l.strip("\" \n").replace("|"," ") for l in line]
#             term = ", ".join(line[:-1])
#             snomed_id = line[-1]
#             if "AND" not in snomed_id:
#                 w.writerow([term, snomed_id])
#             else:
#                 ids = snomed_id.split("AND")
#                 for i in ids:
#                     w.writerow([term, i])

# if __name__ == '__main__':
#     undo_separator()



