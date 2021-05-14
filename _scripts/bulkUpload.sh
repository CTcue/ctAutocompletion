#!/bin/sh
set -e

# ----
# Usage:
#   bash bulkUpload.sh --elastic username:password


# Clear elasticsearch
python3.8 clear_elasticsearch.py --src AUTOCOMPLETE $*
#python3.8 clear_elasticsearch.py --src DBC $*

# Install script dependencies
npm install

# Bulk insert documents into ES / Neo4j
less ./output/concepts.txt | node elasticsearch.js $*
