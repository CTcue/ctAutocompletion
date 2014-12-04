#!/bin/bash

file="./randomQueries.txt"

for ((i=0; i<1000; i+=1))
do
  query=$(head -$((${RANDOM***REMOVED*** % `wc -l < $file` + 1)) $file | tail -1)

  curl -i \
    -H "Accept: application/json" \
    -H "Content-Type:application/json" \
    -X POST --data '{ "query" : "'"$query"'"***REMOVED***' \
    "http://localhost:4050/autocomplete/diagnosis"

done

exit