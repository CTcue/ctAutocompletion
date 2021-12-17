#!/bin/sh
set -e

# ----
# Usage:
#   bash bulkUpload.sh --elastic username:password

# Remove current data from the index
python3.8 clear_elasticsearch.py --src AUTOCOMPLETE $*

# Install script dependencies
yarn install

# Bulk insert documents into Elasticsearch
less ./output/concepts.txt | node elasticsearch.js $*
