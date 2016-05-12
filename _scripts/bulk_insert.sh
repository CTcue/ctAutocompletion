#!/usr/bin/env bash

# less output/*concepts.* | node elasticsearch.js
# less output/*relations.txt | node neo4j.js

less output/farmaco_relations.* | node neo4j.js