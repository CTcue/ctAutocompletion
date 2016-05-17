#!/usr/bin/env bash

# Build list of UMLS concepts + Type
python preprocess/process_concepts.py ./2015AA/META/MRCONSO.RRF ./2015AA/META/MRSTY.RRF ./additional_terms/*.csv > ./output/concepts.txt

# Get useful relations
python preprocess/process_relations.py ./2015AA/META/MRREL.RRF > ./output/relations.txt

# Needs initial UMLS for lookup
python farmaco/crawl.py