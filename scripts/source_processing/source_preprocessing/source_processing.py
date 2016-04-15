import unicodecsv as csv
import importlib
from collections import defaultdict
import os
from source_params import output_folder
import config

def get_terms(source):
    print "import with importlib", source
    mod = importlib.import_module("source_processing.source_preprocessing."+source)
    return mod.get_terms()


def all_terms_to_file(terms, source):

    with open(os.path.join(output_folder,"sourceterms_"+source+".csv"),"wb") as of:
        w = csv.writer(of,delimiter="|",encoding="utf-8")
        for t, source_lan in terms.iteritems():
            if t != "":
                elems = []
                for x in source_lan:
                    if isinstance(x["source_id"],int):
                        x["source_id"]=str(x["source_id"])
                    elems.append(x["source_id"]+"&"+x["lan"])
                w.writerow([t,":".join(elems)])

def terms_to_file_sources():
    sources = ["DHD","GGL_translate","LOINC","snomed_NL"]

    for s in sources:
        terms = get_terms(s)
        all_terms_to_file(terms,s)
        print "nr terms", len(terms)

