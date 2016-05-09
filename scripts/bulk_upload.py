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




def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


def upload(umls_dir, index, add_termfiles=None):

    if add_termfiles:
        print "additional termfiles used", add_termfiles
        for f in add_termfiles:
            if not os.path.isfile(f):
                print f, "not found, terms not used in upload"

        add_termfiles = [f for f in add_termfiles if os.path.isfile(f)]

    bulk = []
    counter = 1

    elastic = Elasticsearch()
    print "[%s]  Creating index: `%s`." % (stamp(), index)
    elastic.indices.delete(index=index, ignore=[400, 404])
    elastic.indices.create(index=index, body=json.load(open("../_mappings/autocomplete.json")))

    print "[%s]  Starting upload." % stamp()

    from collections import defaultdict
    source_counts = defaultdict(int)

    for (cui, conso, types, preferred), (scui, sty) in tqdm(utils.merged_rows(umls_dir, add_termfiles)):

        # if 37300 < int(cui[-6:]) < 37500:
        #     print "cui in range", cui
        # if cui == "C0037369":
        #     print "smoking found in upload  script"
        # if 37500 < int(cui[-6:]):
        #     raw_input()

        if not conso or utils.can_skip_cat(sty):
            continue

        # if cui == "C0037369":
        #     print "smoking found and accepted"
        #     from pprint import pprint
        #     pprint(conso)

        for g in utils.unique_terms(conso, 'normal', cui):

            exact = g["normal"].replace("-", " ").lower()
            types = list(set(sty + types))

            # If normalized concept is reduced to empty string
            if not exact or exact == "":
                continue

            # if cui == "C0037369":
            #     print g

            bulk.append({
                "_index": index,
                "_type": "records",

                "cui"   : cui,
                "pref"  : preferred,    # UMLS preferred term
                "str"   : g["normal"],  # Indexed for autocompletion
                "exact" : exact,  # Indexed for exact term lookup

                "votes"  : 10, # start with 10 for now

                "lang" : g["LAT"],

                "source" : g["SAB"],
                "types"  : types
            })

            if re.search("-ct",g["SAB"]):
                source_counts[g["SAB"]]+=1

        counter += 1

        if counter % 100 == 0:
            helpers.bulk(elastic, bulk)
            bulk = []

    helpers.bulk(elastic, bulk)
    print "[%s]  Uploading complete." % stamp()

    print source_counts

def record_CUIs(umls_dir, add_termfiles=None):
    import unicodecsv as csv

    if add_termfiles:
        for f in add_termfiles:
            if not os.path.isfile(f):
                print f, "not found, terms not used in upload"

        add_termfiles = [f for f in add_termfiles if os.path.isfile(f)]

    output_folder = "relations/data"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    with open(output_folder+"/used_CUIS.csv","wb") as outf:
        w = csv.writer(outf, encoding="utf-8", delimiter=str("|"))
        w.writerow(["CUI:ID(Concept)","term","types:IGNORE"])
        for (cui, conso, types, preferred), (scui, sty) in tqdm(utils.merged_rows(umls_dir, add_termfiles)):

            if not conso or utils.can_skip_cat(sty):
                continue

            for g in utils.unique_terms(conso, 'normal'):

                exact = g["normal"].replace("-", " ").lower()
                types = list(set(sty + types))

                # If normalized concept is reduced to empty string
                if not exact or exact == "":
                    continue


                w.writerow([cui, preferred, ";".join(types)])
                break

        print "[%s]  Recording complete." % stamp()



if __name__ == '__main__':
    import config

    parser = argparse.ArgumentParser(description="ctAutocompletion upload script")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    parser.add_argument('--rec', dest='rec', default="upload", help='Record CUIs instead of uploading to elastic search')
    parser.add_argument('--no_add_terms', dest='no_add_terms', default="false", help='Record CUIs instead of uploading to elastic search')
    args = parser.parse_args()

    umls_dir = args.dir
    index = args.index

    if args.no_add_terms != "false":
        print "no additional term files used"
        add_termfiles=[]
    else:
        add_termfiles = config.add_termfiles

    if args.rec == "upload":
        upload(umls_dir, index, add_termfiles)
    else:
        record_CUIs(umls_dir, add_termfiles)
