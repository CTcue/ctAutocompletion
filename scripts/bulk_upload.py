#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
from py2neo import neo4j, authenticate, Graph
from multiprocessing import Pool
from functools import partial
from tqdm import *
import argparse
import utils
import time
import json
import re
import os
import sys


def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


def canSkip(row):
    if row["CUI1"] == row["CUI2"]:
        return True

    if not row["SAB"] in ["SNOMEDCT_US", "ICD10PCS", "ICD10CM"]:
        return True

    if row["RELA"] in ["", "same_as", "inverse_isa", "has_expanded_form", "was_a"]:
        return True

    return False


# Batch import for neo4j
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


# Upload MRCONSO + additional terms to Elasticsearch
# Returns set of CUI's inserted
def insert_autocompletion(args, add_termfiles=None):
    print "[%s]  Creating index: `%s`." % (stamp(), args.index)
    elastic = Elasticsearch()
    elastic.indices.delete(index=args.index, ignore=[400, 404])
    elastic.indices.create(index=args.index, body=json.load(open("../_mappings/autocomplete.json")))
    print "[%s]  Starting upload." % stamp()


    counter = 0
    usedCui = set();
    bulk    = []

    for (cui, conso, types, preferred), (scui, sty) in tqdm(utils.merged_rows(args.dir, add_termfiles)):
        if not conso or utils.can_skip_cat(sty):
            continue

        usedCui.add(cui)

        for g in utils.unique_terms(conso, 'normal', cui):
            exact = g["normal"].replace("-", " ").lower()
            types = list(set(sty + types))

            # If normalized concept is reduced to empty string
            if not exact or exact == "":
                continue

            bulk.append({
                "_index" : args.index,
                "_type"  : "records",
                "cui"    : cui,
                "pref"   : preferred,   # UMLS preferred term
                "str"    : g["normal"], # Indexed for autocompletion
                "exact"  : exact,       # Indexed for exact term lookup
                "lang"   : g["LAT"],
                "source" : g["SAB"],
                "votes"  : 10,
                "types"  : types
            })

        counter += 1

        if counter > 50:
            counter = 0
            helpers.bulk(elastic, bulk)
            bulk = []

    helpers.bulk(elastic, bulk)
    print "[%s]  Uploading complete." % stamp()


def insert_suggestions(args, db, usedCui):
    print "[%s] Begin read of MRREL" % stamp()

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

    counter = 0
    batch_size = 60
    statements = []

    for row in tqdm(utils.read_rows(args.dir + "/MRREL.RRF", header=rel_header, delimiter="|")):
        if canSkip(row):
            continue

        if not row["CUI1"] in usedCui or not row["CUI2"] in usedCui:
            continue

        counter += 1
        statements.append((row["CUI1"], row["CUI2"], row["RELA"]))

        if counter > batch_size:
            batch_importer(db, statements)
            statements = []
            counter = 0

    # Import remaining statements
    batch_importer(db, statements)
    print "[%s] Complete batch import of relations" % stamp()




if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion upload script")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    parser.add_argument('--username', dest='username', default="neo4j", help='Neo4j username')
    parser.add_argument('--password', dest='password', required=True, help='Neo4j password')
    args = parser.parse_args()


    try:
        authenticate("localhost:7474", args.username, args.password)
        db = Graph()

        # Clear all neo4j entries
        # db.delete_all()

        print "Deleting nodes"
        nodesLeft = 100
        while nodesLeft > 0:
            res = db.cypher.execute("""
                MATCH (n)
                OPTIONAL MATCH (n)-[r]-()
                WITH n, r LIMIT 50000
                DELETE n, r
                RETURN count(n) as cc
            """)
            nodesLeft = res[0]["cc"]

        print "Deleted all nodes"

        db.cypher.execute("CREATE constraint ON (c:Concept) assert c.cui is unique")
        db.cypher.execute("CREATE constraint ON (f:Farma_concept) assert f.id is unique")

        print "Created indexes"

    except Exception as err:
        print err
        print 'Provide a valid neo4j username and password'
        sys.exit(0)


    # Get additional term files (if they can be found in `additional_terms` directory)
    add_termfiles = []

    for f in [ "pharma_kompas", "snomed", "loinc", "customctcue", "mesh"]:
        filename = os.path.abspath(os.path.join(os.path.dirname(__file__), "additional_terms", "mapped_" + f + "_terms.csv"))

        if os.path.exists(filename):
            add_termfiles.append(filename)


    # Update elasticsearch
    usedCui = insert_autocompletion(args, add_termfiles)

    # Add relations into neo4j
    insert_suggestions(args, db, usedCui)

