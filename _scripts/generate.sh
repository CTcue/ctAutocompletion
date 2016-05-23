#!/usr/bin/env bash

# Clear elasticsearch
python clear_elasticsearch.py $*

# Build list of UMLS concepts + Type
python preprocess/process_concepts.py ./2015AA/META/MRCONSO.RRF ./2015AA/META/MRSTY.RRF ./additional_terms/*.csv > ./output/concepts.txt

# + Initial upload to elasticsearch
less ./output/concepts.txt | node elasticsearch.js $*

# Crawl farmaceutisch kompas
# - Needs initial UMLS for lookup
python farmaco/crawl.py

# Get useful relations
python preprocess/process_relations.py ./2015AA/META/MRREL.RRF > ./output/relations.txt
