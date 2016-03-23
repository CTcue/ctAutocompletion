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


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion upload script")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    args = parser.parse_args()

    elastic = Elasticsearch()
    bulk = []
    counter = 1

    print "[%s]  Creating index: `%s`." % (stamp(), args.index)
    elastic.indices.delete(index=args.index, ignore=[400, 404])
    elastic.indices.create(index=args.index, body=json.load(open("./_mappings/autocomplete.json")))

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

            bulk.append({
                "_index": args.index,
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

        counter += 1

        # for co in conso:
        #     print co

        # raw_input("...")

        if counter % 100 == 0:
            helpers.bulk(elastic, bulk)
            bulk = []

    helpers.bulk(elastic, bulk)
    print "[%s]  Uploading complete." % stamp()