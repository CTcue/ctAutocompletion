#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
from tqdm import *
import argparse
import utils
import time
import json
import re
import os

from py2neo import neo4j, authenticate, Node, Graph, Relationship
from tqdm import *


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
    if not row["SAB"] in ["SNOMEDCT_US", "ICD10PCS", "ICD10CM"]:
        return True

    if row["RELA"] in ["", "same_as", "inverse_isa", "has_expanded_form"]:
        return True

    if row["CUI1"] == row["CUI2"]:
        return True

    return False



if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Import UMLS MRREL relations into ctAutocompletion")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the UMLS *.RRF files')
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    parser.add_argument('--username', dest='username', required=True, help='Neo4j username')
    parser.add_argument('--password', dest='password', required=True, help='Neo4j password')

    args = parser.parse_args()


    try:
        authenticate("localhost:7474", args.username, args.password)
        db = Graph()

    except Exception as err:
        print 'Provide a valid Neo4j username and password'



    bulk = []
    counter = 1

    elastic = Elasticsearch()
    print "[%s]  Creating index: `%s`." % (stamp(), args.index)
    elastic.indices.delete(index=args.index, ignore=[400, 404])
    elastic.indices.create(index=args.index, body=json.load(open("../_mappings/autocomplete.json")))

    # Clear all neo4j entries
    db.delete_all()
    db.cypher.execute("CREATE INDEX ON :Concept(cui)")


    usedCui = set();

    print "[%s]  Starting upload." % stamp()
    for (cui, conso, types, preferred), (scui, sty) in tqdm(utils.merged_rows(args.dir)):

        if not conso or utils.can_skip_cat(sty):
            continue

        for g in utils.unique_terms(conso, 'normal'):
            exact = g["normal"].replace("-", " ").lower()
            types = list(set(sty + types))

            # If normalized concept is reduced to empty string
            if not exact or exact == "":
                continue

            usedCui.add(cui)

            bulk.append({
                "_index" : args.index,
                "_type"  : "records",
                "cui"    : cui,
                "pref"   : preferred,    # UMLS preferred term
                "str"    : g["normal"],  # Indexed for autocompletion
                "exact"  : exact,  # Indexed for exact term lookup
                "lang"   : g["LAT"],
                "source" : g["SAB"],
                "types"  : types
            })

        counter += 1

        if counter % 100 == 0:
            helpers.bulk(elastic, bulk)
            bulk = []

    helpers.bulk(elastic, bulk)
    print "[%s]  Uploading complete." % stamp()


    #########
    # NEO4J #
    #########

    counter = 0
    tx = db.cypher.begin()

    for row in tqdm(utils.read_rows(args.dir + "/MRREL.RRF", header=rel_header, delimiter="|")):
        if canSkip(row):
            continue

        if row["CUI1"] in usedCui and row["CUI2"] in usedCui:
            counter += 1

            cypher =  """
                MERGE (a:Concept { cui: '%s' })
                MERGE (b:Concept { cui: '%s' })
                WITH a, b
                    CREATE (b)-[:%s]->(a)
                RETURN a,b
            """ % (row["CUI1"], row["CUI2"], row["RELA"])

            tx.append(cypher)

            if counter % 1000:
                tx.commit()
                tx = db.cypher.begin()


    tx.commit()
    print "[%s] Added %s relations to neo4j" % (stamp(), count)
