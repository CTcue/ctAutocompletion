#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
import unicodecsv as csv
import argparse
import time
import json


def read_rows(filename, delimiter=";"):
    with open(filename, "rb") as f:
        datareader = csv.reader(f, encoding="utf-8", delimiter=str(delimiter))
        header = next(datareader)

        for line in datareader:
            if len(line):
                yield dict(zip(header, line))


def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion upload script for DBC")
    parser.add_argument('--file', dest='file', required=True, help='CSV file with DBC codes')
    parser.add_argument('--delimiter', dest='delimiter', default=",", help='CSV delimiter used')
    parser.add_argument('--index', dest='index', default="dbc_zorgproduct", help='Elasticsearch index for DBC')
    args = parser.parse_args()

    elastic = Elasticsearch()
    bulk = []
    counter = 1

    print "[%s]  Creating index: `%s`." % (stamp(), args.index)
    elastic.indices.delete(index=args.index, ignore=[400, 404])
    elastic.indices.create(index=args.index, body=json.load(open("./_mappings/dbc.json")))

    print "[%s]  Starting upload." % stamp()
    for row in read_rows(args.file, args.delimiter):
        try:
            bulk.append({
                "_index": args.index,
                "_type": "diagnose",

                "diagnose"  : row["DIAGNOSE_OMSCHRIJVING"],
                "code"      : row["DIAGNOSE_CD"],
                "specialism": row["SPECIALISME_CD"]
            })

        except Exception as err:
            print err
            print "ERROR: The provided csv file has a different header / contents than expected."
            break

        counter += 1
        if counter % 200 == 0:
            helpers.bulk(elastic, bulk)
            bulk = []


    helpers.bulk(elastic, bulk)
    print "[%s]  Uploading complete." % stamp()