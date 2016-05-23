#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from py2neo import authenticate, Graph
import argparse


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion database clearing script")
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    parser.add_argument('--user', dest='username', default="neo4j", help='Neo4j username')
    parser.add_argument('--password', dest='password', default="neo4j", help='Neo4j password')
    args = parser.parse_args()


    try:
        print "Clearing Neo4j"
        authenticate("localhost:7474", args.username, args.password)
        db = Graph()
        db.delete_all()

    except Exception as err:
        print 'Provide a valid Neo4j username and password'
        print err