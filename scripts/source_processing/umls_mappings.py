from utils import read_rows, check_row, merged_rows, can_skip_cat
from source_processing.source_preprocessing.source_params import output_folder as input_folder
import unicodecsv as csv
from tqdm import *
from collections import defaultdict
import os
from relations.relation_utils import rel_header_farmacoterms as pharma_header

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
    unique_terms = set()

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
                    unique_terms.add(t[0])
            except KeyError:
                continue
    print "counted terms", count
    log_unique_terms(unique_terms, sourcename)

def umls_mesh_mappings(umls_dir):
    # print "MESH mappings"

    filename = os.path.join(input_folder,"selected_sourceterms_MESH.csv")
    codes = get_terms(filename)

    write_terms(umls_dir, codes, "mapped_mesh_terms.csv","MSH","CODE", "MeSH")

def umls_snomed_mappings(umls_dir):
    # print "SNOMED mappings"

    filename = os.path.join(input_folder,"selected_sourceterms_SNOMED.csv")
    codes = get_terms(filename)
    print len(codes), "codes"

    write_terms(umls_dir,codes, "mapped_snomed_terms.csv","SNOMEDCT_US","SCUI", "orig")

def umls_loinc_mappings(umls_dir):
    # print "LOINC mappings"

    filename = os.path.join(input_folder,"selected_sourceterms_LOINC.csv")
    codes = get_terms(filename)

    write_terms(umls_dir, codes, "mapped_loinc_terms.csv","LNC","CODE", "LOINC")

def umls_pharma_mappings():
    sourcename = "pharma_kompas"
    filename = "relations/data/farmaco_grouped_terms.csv"
    term_by_cui = defaultdict(set)
    unique_terms=set()

    for r in read_rows(filename, delimiter="|",header=pharma_header):

        if r["cuis"]=="":
            continue

        cuis = r["cuis"].split(";")
        for cui in cuis:
            term_by_cui[cui].add(r["term"])

    cuis = list(term_by_cui.keys())
    cuis.sort()

    with open("additional_terms/mapped_pharma_kompas_terms.csv","wb") as outf:
        w = csv.writer(outf, encoding="utf-8",delimiter="|")
        w.writerow(mapping_header)
        for cui in cuis:
            for term in term_by_cui[cui]:
                w.writerow([cui,term,"DUT",sourcename+"-ct"])

    log_unique_terms(unique_terms, sourcename)
# cui|term|lan|source
# C0362109|amoxicilline+clavulanaat|DUT|LOINC-ct


def log_unique_terms(unique_terms, source):
    outfname = os.path.join(input_folder,"unique_mapped_terms_"+source+".csv")
    with open(outfname,"wb") as outf:
        w = csv.writer(outf, delimiter="|",encoding="utf-8")
        for t in unique_terms:
            w.writerow([t])


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


