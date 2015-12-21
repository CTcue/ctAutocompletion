#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
from tqdm import *
import unicodecsv as csv
import argparse
import time


def read_rows(filename, delimiter=";"):
    with open(filename, "rb") as f:
        datareader = csv.reader(f, encoding="utf-8", delimiter=str(delimiter))
        header = next(datareader)

        for line in datareader:
            yield dict(zip(header, line))


def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion upload script")
    parser.add_argument('--file', dest='file', required=True, help='CSV file with DBC codes')
    parser.add_argument('--delimiter', dest='delimiter', default=";", help='CSV delimiter used')
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    args = parser.parse_args()

    elastic = Elasticsearch()
    bulk = []
    counter = 1

    print "[%s]  Starting upload." % stamp()
    for row in tqdm(read_rows(args.file, args.delimiter)):
        description = row["description"]
        if not description:
            description = row["specific"]

        bulk.append({
            "_index": args.index,
            "_type": "dbc_codes",

            "cui"   : row["group"],
            "pref"  : description,  # Display helper
            "str"   : row["code"],  # Indexed for autocompletion
            "exact" : row["code"],

            "votes"  : 20,
            "lang" : "DUT",
            "source" : "CTcue",
            "types"  : ["DBC"]
    ***REMOVED***)

        counter += 1

        if counter % 100 == 0:
            helpers.bulk(elastic, bulk)
            bulk = []

    helpers.bulk(elastic, bulk)
    print "[%s]  Uploading complete." % stamp()