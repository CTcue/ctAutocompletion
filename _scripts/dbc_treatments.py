#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers

import csv
import argparse
import time
import json
import os


def read_rows(filename, delimiter=";"):
    with open(filename, "rb") as f:
        datareader = csv.reader(f, delimiter=str(delimiter))
        header = next(datareader)

        for line in datareader:
            if len(line):
                yield dict(zip(header, line))

def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion upload script for DBC treatment codes & descriptions")
    parser.add_argument('--elastic', dest='elastic', default=None, help='Elasticsearch authentication (optional)')
    parser.add_argument('--file', dest='file', required=True, help='CSV file with DBC codes (20160101 Zorgproducten Tabel v20151119.csv.csv)')
    parser.add_argument('--delimiter', dest='delimiter', default=",", help='CSV delimiter used')
    args = parser.parse_args()

    # Check if Elasticsearch auth is provided
    if args.elastic:
        _auth = tuple(args.elastic.split(":"))
    else:
        _auth = ("", "")

    elastic = Elasticsearch(http_auth=_auth)


    print("[%s]  Starting upload." % stamp())

    bulk = []
    counter = 1

    for row in read_rows(args.file, args.delimiter):
        try:
            # VERSIE, DATUM_BESTAND, PEILDATUM, ZORGPRODUCT_CD, LATIJN_OMS, CONSUMENT_OMS, DECLARATIE_VERZEKERD_CD, DECLARATIE_ONVERZEKERD_CD

            bulk.append({
                "_index": "dbc_zorgproduct",
                "_type": "treatments",

                "description"       : row["CONSUMENT_OMS"],
                "description_latin" : row["LATIJN_OMS"].split(" | "),
                "product_code"      : row["ZORGPRODUCT_CD"]
            })

        except Exception as err:
            print(err)
            print("ERROR: The provided csv file has a different header / contents than expected.")
            break

        counter += 1

        if counter % 200 == 0:
            helpers.bulk(elastic, bulk)
            bulk = []


    helpers.bulk(elastic, bulk)
    print("[%s]  Uploading complete." % stamp())
