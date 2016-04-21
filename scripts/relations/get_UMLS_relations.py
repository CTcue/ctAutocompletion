from utils import read_rrf, read_rows
import unicodecsv as csv
from tqdm import *
import relations.relation_utils as ru

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


def write_neo4j_query():
    with open("relations/data/neo4j_upload.txt","wb") as outf:

        upload = "<ABSOLUTE PATH TO neo4j/bin/neo4j-import.bat> --into snomed.db --id-type string "
        upload += "--nodes:Concept umls_concepts.csv "
        upload += "--nodes:Concept_Type concept_types.csv "
        upload += "--relationships relations_concepts.csv "
        upload += "--relationships rels_concept_type.csv "
        upload += '--delimiter "|"'
        outf.write(upload)


def read_CUIS():
    used_CUIs = ru.get_CUIS()

def extract_rels(umls_dir):
    print "write neo4j query"
    write_neo4j_query()
    print "get cuis"
    used_CUIs = ru.get_CUIS()

    rel_count = 0
    non_snomed_count=0

    from collections import defaultdict
    counts = defaultdict(int)

    with open("relations/data/relations_concepts.csv","wb") as outf:
        w =  csv.writer(outf, encoding="utf-8",delimiter = "|")
        w.writerow([":START_ID(Concept)",":END_ID(Concept)",":TYPE", "source"])

        print "scan relations"
        for row in tqdm(read_rows(umls_dir+"/MRREL.RRF", header = rel_header, delimiter="|")):

            if ru.canSkip(row, used_CUIs):
                continue

            counts[(row["SAB"],row["RELA"])]+=1
            w.writerow([row["CUI2"], row["CUI1"],row["RELA"],row["SAB"]])

            rel_count+=1

    print "\n\n\n"

    print "%i relations extracted"%rel_count
    print "of which %i non snomed relations"%non_snomed_count

    rel_types = list(counts.keys())
    rel_types.sort()

    with open("relations/data/overview_relation_types.csv","wb") as outf:
            w =  csv.writer(outf, encoding="utf-8",delimiter = ",")
            w.writerow(["rel_type","rel_source"])
            for r in rel_types:
                print r, counts[r]
                w.writerow([r[0],r[1], counts[r]])



