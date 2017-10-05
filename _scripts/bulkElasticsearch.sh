#!/bin/sh

set -e

python clear_elasticsearch.py --src AUTOCOMPLETE $*

less ./output/concepts.* | node elasticsearch.js $*
