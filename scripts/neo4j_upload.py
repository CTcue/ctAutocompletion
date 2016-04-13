from utils import read_rows
from py2neo import authenticate, Graph, Relationship
import argparse


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

def canSkip(row):
    if not row["SAB"] in ["SNOMEDCT_US", "ICD10PCS", "ICD10CM"]:
        return True

    if row["RELA"] in ["", "same_as", "inverse_isa", "has_expanded_form"]:
        return True

    if row["CUI1"] == row["CUI2"]:
        return True

    return False



if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Import UMLS MRREL relations into ctAutocompletion")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    parser.add_argument('--username', dest='username', required=True, help='Neo4j username')
    parser.add_argument('--password', dest='password', required=True, help='Neo4j password')

    args = parser.parse_args()


    try:
        authenticate("localhost:7474", args.username, args.password)
        db = Graph()
    except Exception as err:
        print 'Provide a valid Neo4j username and password'


    # Clear all
    # db.delete_all()

    # db.cypher.execute("CREATE INDEX ON :Group(name)")
    # db.cypher.execute("CREATE INDEX ON :Concept(name)")
    # db.cypher.execute("CREATE INDEX ON :Concept(cui)")



    for row in read_rows(args.dir + "/MRREL.RRF", header=rel_header, delimiter="|"):
        if canSkip(row):
            continue


        print row["CUI2"], row["RELA"], row["CUI1"]
        raw_input("..")