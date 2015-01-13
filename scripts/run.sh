#!/bin/bash

# Elasticsearch index
autocomplete="autocomplete"
expander="expander"

curl -XDELETE "http://localhost:9200/$autocomplete"
echo " index deleted"

curl -XDELETE "http://localhost:9200/$expander"
echo " index deleted"

curl -XPUT "http://localhost:9200/$autocomplete" -d '{
  "settings" : {
    "number_of_shards"   : 1,
    "number_of_replicas" : 0,

    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type"     : "edge_ngram",
          "min_gram" : 2,
          "max_gram" : 12
        }
      },

      "analyzer": {
        "autocomplete": {
          "type":      "custom",
          "tokenizer": "standard",
          "filter": [
            "asciifolding",
            "lowercase",
            "autocomplete_filter"
          ]
        }
      }
    }
  }
}'
echo " new index created"

curl -XPUT "http://localhost:9200/$expander" -d '{
  "settings" : {
    "number_of_shards"   : 1,
    "number_of_replicas" : 0
  }
}'
echo " new index created"

curl -XPUT "http://localhost:9200/$autocomplete/records/_mapping" -d '{
"records" : {
    "properties": {
      "cui"  : { "type" : "string", "index": "not_analyzed" },
      "boost" : { "type": "float", "index": "not_analyzed" },

      "str" : { "type" : "string", "analyzer": "autocomplete" }
    }
  }
}'
echo " mapping added"

curl -XPUT "http://localhost:9200/$expander/records/_mapping" -d '{
"records" : {
    "properties": {
      "cui"   : { "type" : "string", "index": "not_analyzed" },
      "type"  : { "type" : "string", "index": "not_analyzed" },

      "str" : { "type" : "string", "index": "not_analyzed" }
    }
  }
}'
echo " mapping added"


total=$(node count.js)
echo -e "\nInserting $total UMLS entries\n"

for ((i=1, j=i+4999; i<total; i+=5000, j=i+4999))
do
  node --harmony populate.js $i $j
  sleep 1
done

exit