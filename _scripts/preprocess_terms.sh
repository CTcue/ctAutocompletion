#!/usr/bin/env bash

python preprocess/main.py ./2015AA/META/MRCONSO.RRF ./2015AA/META/MRSTY.RRF ./additional_terms/*.csv > ./output/concepts.txt

python relations/main.py --dir ./2015AA/META/ > ./output/relations.txt