#!/bin/bash

file="./randomQueries.txt"

for ((i=0; i<1000; i+=1))
do
  query=$(head -$((${RANDOM} % `wc -l < $file` + 1)) $file | tail -1)

  curl -i \
    -H "Accept: application/json" \
    -H "Content-Type:application/json" \
    -X POST --data '{ "query" : "'"$query"'"}' \
    "http://localhost:4050/autocomplete/diagnosis"

done

exit