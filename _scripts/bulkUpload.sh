#!/bin/sh
set -e

# Clear elasticsearch
python clear_elasticsearch.py --src AUTOCOMPLETE $*
# python clear_neo4j.py $*

# Bulk insert documents into ES / Neo4j
less ./output/concepts.* | node elasticsearch.js $*
# less ./output/*relations.* | node neo4j.js $*
