from utils import read_rows, check_row, merged_rows, can_skip_cat
from source_processing.source_preprocessing.source_params import output_folder as input_folder
import unicodecsv as csv
from tqdm import *
from collections import defaultdict
import os

mapping_header = ["cui","term","lan","source"]

output_folder = "additional_terms"
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

def filter_source(umls_dir,source, required_code):
    for (cui, conso, types, preferred), (scui, sty) in tqdm(merged_rows(umls_dir)):
        if can_skip_cat(sty):
            continue

        if not conso:
            continue

        codes = set()
        for g in conso:
            if g["SAB"] == source and g[required_code] not in codes:
                yield {"cui":cui, "source_id":g[required_code]***REMOVED***
                codes.add(g[required_code])

def get_terms(filename):
    codes = defaultdict(list)
    term_check = defaultdict(set)

    for r in read_rows(filename,delimiter="|", header=["term","source_locs"]):
        for s in r["source_locs"].split(":"):
            s = s.split("&")
            try:
                if r["term"] not in term_check[s[0]]:
                    codes[s[0]].append((r["term"],s[1],s[2]))
                    term_check[s[0]].add(r["term"])
            except:
                print s
    print "terms read"
    return dict(codes)


def write_terms(umls_dir, codes, filename_out,sourcename,map_key, source_out):
    count = 0
    write_source=source_out
    with open(os.path.join(output_folder,filename_out),"wb") as outf:
        w = csv.writer(outf, encoding="utf-8",delimiter="|")
        w.writerow(mapping_header)
        for mapping in filter_source(umls_dir, sourcename,map_key):
            try:
                # print "mapping",mapping["cui"],mapping["source_id"]
                # print "set", codes[mapping["source_id"]]
                for t in codes[mapping["source_id"]]:
                    if source_out == "orig":
                        write_source =t[2]
                    count +=1
                    w.writerow([mapping["cui"],t[0],map_language(t[1]),write_source+"-ct"])
            except KeyError:
                pass
    print "counted terms", count

def umls_mesh_mappings(umls_dir):
    print "MESH mappings"

    filename = os.path.join(input_folder,"selected_sourceterms_MESH.csv")
    codes = get_terms(filename)

    write_terms(umls_dir, codes, "mapped_mesh_terms.csv","MSH","CODE", "MeSH")

def umls_snomed_mappings(umls_dir):
    print "SNOMED mappings"

    filename = os.path.join(input_folder,"selected_sourceterms_SNOMED.csv")
    codes = get_terms(filename)
    print len(codes), "codes"

    write_terms(umls_dir,codes, "mapped_snomed_terms.csv","SNOMEDCT_US","SCUI", "orig")

def umls_loinc_mappings(umls_dir):
    print "LOINC mappings"

    filename = os.path.join(input_folder,"selected_sourceterms_LOINC.csv")
    codes = get_terms(filename)

    write_terms(umls_dir, codes, "mapped_loinc_terms.csv","LNC","CODE", "LOINC")

def map_language(l):
    if l == "en":
        return "ENG"
    elif l =="nl":
        return "DUT"
    print "unknown language", l
    return l



if __name__ == '__main__':
    umls_mesh_mappings()

    umls_snomed_mappings()

    umls_loinc_mappings()



