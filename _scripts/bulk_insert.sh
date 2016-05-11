#!/usr/bin/env bash

less output/concepts.txt | node elasticsearch.js
# less output/relations.txt | node neo4j.js