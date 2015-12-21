#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
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
    args = parser.parse_args()

    for row in read_rows(args.file, args.delimiter):
        print '"%s",' % row["code"]