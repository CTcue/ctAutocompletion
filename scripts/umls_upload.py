#!/usr/bin/python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
from py2neo import neo4j, authenticate
from multiprocessing import Pool
from functools import partial
from tqdm import *
import argparse
import utils
import time
import json
import re
import os



"""
MRCONSO contains rows with cui, source and term
MRSTY contains rows with cui and type

The script does the following:
    1. Create a group by cui code, for both lists
    2. Filter mrconso terms that are "obsolete"
    3. Combine mrconso and mrsty groups by their cui as tuple ((conso_cui, conso_terms), (sty_cui, sty_terms))
    4. Inside the groups of synonyms:
        a. Check for very similar spellings with normalization
        b. Pick SNOMED for complete duplicates
        c. Create subgroups by language/spelling
    5. Generate category (diagnosis, medication, labresult etc) based on STY and words in descriptions
    6. Upload to Elasticsearch
"""




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

def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


def canSkip(row):
    if row["CUI1"] == row["CUI2"]:
        return True

    if not row["SAB"] in ["SNOMEDCT_US", "ICD10PCS", "ICD10CM"]:
        return True

    if row["RELA"] in ["", "same_as", "inverse_isa", "has_expanded_form"]:
        return True

    return False



def batch_importer(graph, statements):
    # First import concepts
    tx = graph.cypher.begin()
    cyph = "MERGE (:Concept {cui: {name}})"
    for (A, B, rel) in statements:
        tx.append(cyph, {"name": A})
        tx.append(cyph, {"name": B})
    tx.commit()

    # Then use fast Match + Creation of rel
    tx = graph.cypher.begin()
    cyph = "MATCH (a:Concept {cui: {A} }), (b:Concept {cui: {B} }) CREATE (b)-[:%s]->(a)" % rel
    for (A, B, rel) in statements:
        tx.append(cyph, {"A": A, "B": B})
    tx.commit()




if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Import UMLS MRREL relations into ctAutocompletion")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the UMLS *.RRF files')
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    # parser.add_argument('--username', dest='username', required=True, help='Neo4j username')
    # parser.add_argument('--password', dest='password', required=True, help='Neo4j password')
    args = parser.parse_args()


    counter = 0
    usedCui = set();
    elastic = Elasticsearch()

    print "[%s]  Creating index: `%s`." % (stamp(), args.index)
    elastic.indices.delete(index=args.index, ignore=[400, 404])
    elastic.indices.create(index=args.index, body=json.load(open("../_mappings/autocomplete.json")))


    print "[%s]  Starting upload." % stamp()


    bulk = []

    for (cui, conso, types, preferred), (scui, sty) in tqdm(utils.merged_rows(args.dir)):
        if not conso or utils.can_skip_cat(sty):
            continue

        usedCui.add(cui)

        for g in utils.unique_terms(conso, 'normal'):
            exact = g["normal"].replace("-", " ").lower()
            types = list(set(sty + types))

            # If normalized concept is reduced to empty string
            if not exact or exact == "":
                continue

            bulk.append({
                "_index" : args.index,
                "_type"  : "records",
                "cui"    : cui,
                "pref"   : preferred,    # UMLS preferred term
                "str"    : g["normal"],  # Indexed for autocompletion
                "exact"  : exact,        # Indexed for exact term lookup
                "lang"   : g["LAT"],
                "source" : g["SAB"],
                "types"  : types
            })

        counter += 1

        if counter > 50:
            counter = 0
            helpers.bulk(elastic, bulk)
            bulk = []


    # Insert remaining concepts
    helpers.bulk(elastic, bulk)

    print "[%s]  Uploading complete, added %s CUI's" % (stamp(), len(usedCui))


    #########
    # NEO4J #
    #########

    # try:
    #     authenticate("localhost:7474", "neo4j", "test123")
    #     db = Graph()
    # except Exception as err:
    #     print 'Provide a valid Neo4j username and password'


    # # Clear all neo4j entries
    # db.delete_all()
    # db.cypher.execute("CREATE constraint ON (c:Concept) assert c.cui is unique")


    # counter = 0
    # batch_size = 30
    # statements = []

    # print "[%s] Begin read of MRREL" % stamp()

    # for row in tqdm(utils.read_rows(args.dir + "/MRREL.RRF", header=rel_header, delimiter="|")):
    #     if canSkip(row):
    #         continue

    #     if not row["CUI1"] in usedCui or not row["CUI2"] in usedCui:
    #         continue

    #     counter += 1
    #     statements.append((row["CUI1"], row["CUI2"], row["RELA"]))

    #     if counter > batch_size:
    #         batch_importer(db, statements)
    #         statements = []
    #         counter = 0

    # # Import remaining statements
    # batch_importer(db, statements)

    # print "[%s] Complete batch import of relations" % stamp()