#!/usr/bin/python
from __future__ import unicode_literals
from py2neo import authenticate, Graph
import argparse
import sys


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="ctAutocompletion database clearing script")
    parser.add_argument('--src', dest='src', default=None, help='')
    parser.add_argument('--elastic', dest='elastic', default=None, help='Elasticsearch authentication (optional)')
    parser.add_argument('--neo4j', dest='neo4j', default=None, help='Neo4j authentication (required)')
    args = parser.parse_args()

    try:
        # Check if Neo4j auth is provided
        if args.neo4j:
            (username, password) = tuple(args.neo4j.split(":"))
        else:
            username = "neo4j"
            password = "neo4j"

        authenticate("localhost:7474", username, password)
        db = Graph()
        db.delete_all()

    except Exception as err:
        print("Please provide Neo4j authentication\n\t--neo4j 'username:secret-password'")
        sys.exit(1)
