#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch
import argparse
import sys
import json


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion database clearing script")
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    parser.add_argument('--elastic', dest='elastic', default=None, help='Elasticsearch authentication (optional)')
    parser.add_argument('--neo4j', dest='neo4j', help='Neo4j authentication (required)')
    args = parser.parse_args()

    try:
        # Check if Elasticsearch auth is provided
        if args.elastic:
            _auth = tuple(args.elastic.split(":"))
        else:
            _auth = ("", "")

        es = Elasticsearch(timeout=60, http_auth=_auth)
        es.indices.delete(index=args.index, ignore=[400, 404])
        es.indices.create(index=args.index, body=json.load(open("../_mappings/autocomplete.json")))
    except Exception as err:
        print "Please provide elasticsearch authentication\n\t--elastic 'username:secret-password'"
        sys.exit(1)
