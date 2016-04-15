from utils import read_rrf, read_rows
import unicodecsv as csv
from tqdm import *

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

def get_CUIS():
    types = set()
    cuis = set()
    print "read CUIs"
    with open("relations/data/relations_types.csv","wb") as outf:
        w =  csv.writer(outf, encoding="utf-8",delimiter = "|")
        w.writerow([":START_ID(Concept)",":END_ID(CONCEPT_TYPE)",":TYPE"])
        for r in tqdm(read_rows("relations/data/used_CUIs.csv",delimiter="|", header=["CUI","term","types"], replace_header=True)):
            cuis.add(r["CUI"])
            cur_types = r["types"].split(";")
            types.update(cur_types)
            for ct in cur_types:
                w.writerow([r["CUI"],ct, "Concept_type"])

    with open("relations/data/concepts_types.csv","wb") as outf:
        w =  csv.writer(outf, encoding="utf-8",delimiter = "|")
        w.writerow([":ID(Concept)"])
        for t in types:
            w.writerow([t])

    with open("relations/data/neo4j_upload.txt","wb") as outf:
        w =  csv.writer(outf, encoding="utf-8",delimiter = "|")
        upload = "<ABSOLUTE PATH TO neo4j/bin/neo4j-import.bat> --into snomed.db --id-type string "
        upload += "--nodes:Concept used_CUIs.csv --nodes:Concept custom_concepts.csv "
        upload += "--nodes:Type concepts_types.csv "
        upload += "--relationships relations_concepts.csv --relationships custom_concept_relations.csv "
        upload += "--relationships relations_types.csv --relationships custom_concept_type_relations.csv"
        w.writerow([upload])

    print "CUIs done"
    return cuis


def extract_rels(umls_dir):
    used_CUIs = get_CUIS()
    rel_count = 0
    non_snomed_count=0

    from collections import defaultdict
    counts = defaultdict(int)
    rel_overview = set()

    with open("relations/data/relations_concepts.csv","wb") as outf:
        w =  csv.writer(outf, encoding="utf-8",delimiter = "|")
        w.writerow([":START_ID(Concept)",":END_ID(Concept)",":TYPE", "source"])

        print "scan relations"
        for row in tqdm(read_rows(umls_dir+"/MRREL.RRF", header = rel_header, delimiter="|")):
            # print row
            if row["SAB"] in ["SNOMEDCT_US", "ICD10PCS", "ICD10CM"]:


                if row["SAB"]!="SNOMEDCT_US":
                    non_snomed_count+=1
                counts[row["SAB"]]+=1

                if row["RELA"] in ["","inverse_isa","has_expanded_form"]:
                    continue

                if row["CUI1"] in used_CUIs and row["CUI2"] in used_CUIs:
                    w.writerow([row["CUI1"],row["CUI2"],row["RELA"],row["SAB"]])

                    rel_overview.add((row["RELA"],row["SAB"]))
                    rel_count+=1

    with open("relations/data/overview_relation_types.csv","wb") as outf:
        w =  csv.writer(outf, encoding="utf-8",delimiter = ",")
        w.writerow(["rel_type","rel_source"])
        for r in rel_overview:
            print r[1], "\t",r[0]
            w.writerow(r)
    print "\n\n\n"

    print "%i relations extracted"%rel_count
    print "of which %i non snomed relations"%non_snomed_count
    print counts



