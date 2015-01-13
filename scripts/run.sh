#!/bin/bash

# Elasticsearch index
index="autocomplete"

curl -XDELETE "http://localhost:9200/$index"
echo " index deleted"

curl -XPUT "http://localhost:9200/$index" -d '{
  "settings" : {
    "number_of_shards"   : 1,
    "number_of_replicas" : 0,

    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type":     "edge_ngram",
          "min_gram": 3,
          "max_gram": 12
    ***REMOVED***
  ***REMOVED***,

      "analyzer": {
        "autocomplete": {
          "type":      "custom",
          "tokenizer": "standard",
          "filter": [
            "asciifolding",
            "lowercase",
            "autocomplete_filter"
          ]
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***'
echo " new index created"

curl -XPUT "http://localhost:9200/$index/records/_mapping" -d '{
"records" : {
    "properties": {
      "cui"   : { "type" : "string", "index": "not_analyzed" ***REMOVED***,
      "type"  : { "type" : "string", "index": "not_analyzed" ***REMOVED***,

      "startsWith" : { "type" : "string", "index": "not_analyzed" ***REMOVED***,
      "boost" : { "type": "float", "index": "not_analyzed" ***REMOVED***,

      "eng"   : { "type" : "string", "analyzer": "autocomplete" ***REMOVED***,
      "dut"   : { "type" : "string", "analyzer": "autocomplete" ***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***'
echo " mapping added"

total=$(node count.js)
echo -e "\nInserting $total UMLS entries\n"

for ((i=1, j=i+4999; i<total; i+=5000, j=i+4999))
do
  node --harmony populate.js $i $j
  sleep 1
done

exit