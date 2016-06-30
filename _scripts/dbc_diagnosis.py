#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
import unicodecsv as csv
import argparse
import time
import json
import os


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
    parser = argparse.ArgumentParser(description="ctAutocompletion upload script for DBC diagnosis descriptions")
    parser.add_argument('--elastic', dest='elastic', default=None, help='Elasticsearch authentication (optional)')
    parser.add_argument('--file', dest='file', required=True, help='CSV file with DBC codes (04_REF_DGN.csv)')
    parser.add_argument('--delimiter', dest='delimiter', default=",", help='CSV delimiter used')
    args = parser.parse_args()

    # Check if Elasticsearch auth is provided
    if args.elastic:
        _auth = tuple(args.elastic.split(":"))
    else:
        _auth = ("", "")

    elastic = Elasticsearch(http_auth=_auth)


    print "[%s]  Starting upload." % stamp()

    bulk = []
    counter = 1

    # Include labels
    specialties = [
        { "number": "0301", "label": "Oogheelkunde" ***REMOVED***,
        { "number": "0302", "label": "KNO" ***REMOVED***,
        { "number": "0303", "label": "Heelkunde" ***REMOVED***,
        { "number": "0304", "label": "Plastische chirurgie" ***REMOVED***,
        { "number": "0305", "label": "Orthopedie" ***REMOVED***,
        { "number": "0306", "label": "Urologie" ***REMOVED***,
        { "number": "0307", "label": "Gynaecologie" ***REMOVED***,
        { "number": "0308", "label": "Neurochirurgie" ***REMOVED***,
        { "number": "0310", "label": "Dermatologie" ***REMOVED***,
        { "number": "0313", "label": "Inwendige Geneeskunde" ***REMOVED***,
        { "number": "0316", "label": "Kindergeneeskunde" ***REMOVED***,
        { "number": "0318", "label": "MDL" ***REMOVED***,
        { "number": "0320", "label": "Cardiologie" ***REMOVED***,
        { "number": "0322", "label": "Longgeneeskunde" ***REMOVED***,
        { "number": "0324", "label": "Reumatologie" ***REMOVED***,
        { "number": "0326", "label": "Allergologie" ***REMOVED***,
        { "number": "0327", "label": "Revalidatiegeneeskunde" ***REMOVED***,
        { "number": "0328", "label": "Cardio pulmonale chirurgie" ***REMOVED***,
        { "number": "0329", "label": "Consultatieve Psychiatrie" ***REMOVED***,
        { "number": "0330", "label": "Neurologie" ***REMOVED***,
        { "number": "0335", "label": "Klinische Geriatrie" ***REMOVED***,
        { "number": "0361", "label": "Radiotherapie" ***REMOVED***,
        { "number": "0362", "label": "Radiologie" ***REMOVED***,
        { "number": "0389", "label": "Anesthesiologie" ***REMOVED***,
        { "number": "0390", "label": "Klinische Genetica" ***REMOVED***,
        { "number": "1900", "label": "Audiologie" ***REMOVED***,
        { "number": "8418", "label": "Geriatrische revalidatiezorg" ***REMOVED***
    ];

    for specialism in specialties:
        bulk.append({
            "_index": "dbc_zorgproduct",
            "_type": "specialism",

            "label"      : specialism["label"],
            "specialism" : specialism["number"]
    ***REMOVED***)


    for row in read_rows(args.file, args.delimiter):
        try:
            # VERSIE,DATUM_BESTAND,PEILDATUM,DIAGNOSE_CD,SPECIALISME_CD,DIAGNOSE_OMSCHRIJVING

            bulk.append({
                "_index": "dbc_zorgproduct",
                "_type": "diagnosis",

                "label"     : row["DIAGNOSE_OMSCHRIJVING"],
                "code"      : row["DIAGNOSE_CD"],
                "specialism": row["SPECIALISME_CD"]
        ***REMOVED***)

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