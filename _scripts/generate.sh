#!/usr/bin/env bash

mkdir output
mkdir additional_terms

set -e

# # Clear elasticsearch
python clear_elasticsearch.py --src AUTOCOMPLETE $*

# Extract normalized concept list from MRCONSO.RRF
python preprocess/clean_mrconso.py

# Build list of UMLS concepts + Type
python preprocess/process_concepts.py ./cleaned_terms/CLEAN_MRCONSO.RRF ./2015AA/META/MRSTY.RRF > ./output/concepts.txt

# + Initial upload to elasticsearch
less ./output/concepts.txt | node elasticsearch.js $*

# Crawl farmaceutisch kompas
# - Needs initial UMLS for lookup
python farmaco/crawl.py
python preprocess/process_concepts.py ./additional_terms/*.csv > ./output/farma__concepts.txt
less ./output/farma__concepts.txt | node elasticsearch.js $*

# Get useful relations
python preprocess/process_relations.py ./2015AA/META/MRREL.RRF > ./output/relations.txt
