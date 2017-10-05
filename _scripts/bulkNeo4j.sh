#!/bin/sh

set -e

python clear_neo4j.py $*

less ./output/*relations.* | node neo4j.js $*
