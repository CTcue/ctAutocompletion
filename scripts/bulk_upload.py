#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
from tqdm import *
from itertools import izip
import unicodecsv as csv
import argparse
import utils
import time
import json
import os
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

def read_rrf(filename, header, wanted, delimiter="|"):
    with open(filename, "rb") as f:
        datareader = csv.reader(f, encoding="utf-8", delimiter=str(delimiter))
        first = next(datareader)
        tmp = dict(zip(header, first))
        row = { k: tmp[k] for k in wanted ***REMOVED***

        cui = tmp['CUI']
        group = [row]

        for line in datareader:
            tmp = dict(zip(header, line))
            row = { k: tmp[k] for k in wanted ***REMOVED***

            if cui == tmp['CUI']:
                group.append(row)
            else:
                yield (cui, group)

                # reset
                cui = tmp['CUI']
                group = [row]


def read_conso(umls_dir):
    header = [
        "CUI",
        "LAT",
        "TS",
        "LUI",
        "STT",
        "SUI",
        "ISPREF",
        "AUI",
        "SAUI",
        "SCUI",
        "SDUI",
        "SAB",
        "TTY",
        "CODE",
        "STR",
        "SRL",
        "SUPPRESS ",
        "CVF"
    ]

    wanted = ["LAT", "SAB", "STT", "TS", "ISPREF", "TTY", "STR"]

    filename = os.path.join(umls_dir, "MRCONSO.rrf")
    for cui, group in read_rrf(filename, header, wanted):
        filtered = []
        types = []
        preferred = None

        for g in group:
            # Get first "english preferred" term available
            if not preferred and g["TS"] == "P" and g["LAT"] == "ENG":
                preferred = g["STR"]

            if utils.check_row(g):
                row = { k: g[k] for k in wanted ***REMOVED***
                row["normal"] = utils.normalize(row["STR"])
                filtered.append(row)

            # Extract category indicators (the FN terms usually have one)
            if g["TTY"] == "FN":
                match = re.search(utils._combined, g["STR"])
                if match and match.groups():
                    types.append(match.groups()[0].strip(" [()]"))

        yield (cui, filtered, types, preferred)


def read_sty(umls_dir):
    header = [
        "CUI",
        "TUI",
        "STN",
        "STY",
        "ATUI",
        "CVF"
    ]

    wanted = ["STY"]

    filename = os.path.join(umls_dir, "MRSTY.rrf")
    for cui, group in read_rrf(filename, header, wanted):
        filtered = [g["STY"] for g in group]
        yield (cui, filtered)


def merged_rows(umls_dir):
    return izip(read_conso(umls_dir), read_sty(umls_dir))


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
    elastic.indices.create(index=args.index, body=json.load(open("mapping.json")))

    print "[%s]  Starting upload." % stamp()
    for (cui, conso, types, preferred), (scui, sty) in tqdm(merged_rows(args.dir)):
        if not conso or utils.can_skip_cat(sty):
            continue

        for g in utils.unique_terms(conso, 'normal'):
            # If normalized concept is reduced to empty string
            if not g or g == "":
                continue

            types = list(set(sty + types))

            bulk.append({
                "_index": args.index,
                "_type": "records",

                "cui"   : cui,
                "pref"  : preferred,    # UMLS preferred term
                "str"   : g["normal"],  # Indexed for autocompletion
                "exact" : g["normal"].replace("-", " ").lower(),  # Indexed for exact term lookup

                "votes"  : 10, # start with 10 for now

                "lang" : g["LAT"],

                "source" : g["SAB"],
                "types"  : types
        ***REMOVED***)

        counter += 1

        if counter % 100 == 0:
            helpers.bulk(elastic, bulk)
            bulk = []

    helpers.bulk(elastic, bulk)
    print "[%s]  Uploading complete." % stamp()