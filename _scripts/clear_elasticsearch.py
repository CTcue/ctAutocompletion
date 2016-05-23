#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
from py2neo import authenticate, Graph
import argparse
import os
import json


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion database clearing script")
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    parser.add_argument('--user', dest='username', default="neo4j", help='Neo4j username')
    parser.add_argument('--password', dest='password', default="neo4j", help='Neo4j password')
    args = parser.parse_args()


    _auth = ("", "")

    try:
        basepath = os.path.dirname(__file__)
        config_filename = os.path.abspath(os.path.join(basepath, "..", "..", "ctcue-config", "local_elasticsearch_shield.json"))

        with open(config_filename) as config:
            _config = json.load(config)
            _auth   = _config["_shield"].split(":")

    except Exception as err:
        print err

    try:
        es = Elasticsearch(timeout=60, http_auth=_auth)
        es.indices.delete(index=args.index, ignore=[400, 404])
        es.indices.create(index=args.index, body=json.load(open("../_mappings/autocomplete.json")))
    except Exception as err:
        print err
