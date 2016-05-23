#!/usr/bin/env bash

# Build list of UMLS concepts + Type
python preprocess/process_concepts.py ./2015AA/META/MRCONSO.RRF ./2015AA/META/MRSTY.RRF ./additional_terms/*.csv > ./output/concepts.txt
