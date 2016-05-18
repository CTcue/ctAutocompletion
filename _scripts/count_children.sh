#!/usr/bin/env bash

python counting/count_children.py < ./output/relations.txt | sort -k2 --numeric-sort --reverse > counts.txt