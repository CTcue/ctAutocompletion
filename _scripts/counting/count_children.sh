#!/usr/bin/env bash

python count_children.py < ../output/relations.txt | sort -k2 --numeric-sort --reverse > counts.txt