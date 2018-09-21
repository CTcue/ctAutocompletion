#!/usr/bin/env bash

# Build list of UMLS concepts + Type
# python preprocess/process_concepts.py ./cleaned_terms/CLEAN_MRCONSO.RRF ./2015AA/META/MRSTY.RRF > ./output/concepts.txt

python preprocess/process_concepts.py ./cleaned_terms/testje.txt ./2015AA/META/MRSTY.RRF > ./output/concepts2.txt
