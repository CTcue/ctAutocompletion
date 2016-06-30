#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch
import argparse
import sys
import json


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion database clearing script")
    parser.add_argument('--src', dest='src', help='Index/document source type (AUTOCOMPLETE | DBC)')
    parser.add_argument('--elastic', dest='elastic', default=None, help='Elasticsearch authentication (optional)')
    parser.add_argument('--neo4j', dest='neo4j', help='Neo4j authentication (required)')
    args = parser.parse_args()

    try:
        # Check if Elasticsearch auth is provided
        if args.elastic:
            _auth = tuple(args.elastic.split(":"))
        else:
            _auth = ("", "")

    except Exception as err:
        print "Please provide elasticsearch authentication\n\t--elastic 'username:secret-password'"
        sys.exit(1)


    es = Elasticsearch(timeout=60, http_auth=_auth)

    if args.src == "AUTOCOMPLETE":
        # Setup autocomplete index
        print "CLEARING FOR AUTOCOMPLETE"
        es.indices.delete(index="autocomplete", ignore=[400, 404])
        es.indices.create(index="autocomplete", body=json.load(open("../_mappings/autocomplete.json")))

    elif args.src == "DBC":
        # Setup dbc index
        print "CLEARING FOR DBC"
        es.indices.delete(index="dbc_zorgproduct", ignore=[400, 404])
        es.indices.create(index="dbc_zorgproduct", body=json.load(open("../_mappings/dbc.json")))

    else:
        print "PLEASE PROVIDE A VALID: --type"