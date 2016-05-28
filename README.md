ctAutocompletion
=======

Find relevant UMLS terms based on user input. The autocompletion algorithm prioritizes exact matches, and if non are found it prefers prefix matches. You can also send multiple words and for each seperate term it does a prefix lookup, so you can send queries like `anky spondy` or `maj dep dis`.


```
curl -XPOST 'http://localhost:4080/autocomplete' -d '{
    "query" : "Major dep"
}'

// Results in

{
  "took": 2,
  "hits": [
    {
      "str": "Major depression",
      "cui": "C1269683",
    },
    {
      "str": "major depressive disorder",
      "cui": "C1269683",
    },
    {
      "str": "major depressive illness",
      "cui": "C1269683",
    },

    ...
}
```


## Installation

* Make sure you have NodeJS (>5.x) and Elasticsearch (>2.x) installed
  * Check if elasticsearch running
  * Optionally you can install Neo4j
* Run `npm install`
* Run `pip install -r requirements.txt`
* Obtain an UMLS directory with MRCONSO.RRF and MRSTY.RRF (etc)
  * You will need an [UMLS license](https://www.nlm.nih.gov/research/umls/) to obtain these sources
* Adjust the paths inside `_scripts/generate.sh` to locate your UMLS directory
  * If you don't need the relations, you can comment the neo4j parts
* Run `bash ./_scripts/generate.sh` (this may take a while)
* Run `bash ./_scripts/bulkUpload.sh`

You can now run `npm start` or `node app.js` to start your local ctAutocompletion server on http://localhost:4080 by default.


## Contributing

You can run unit tests with `npm test`.

If you feel something is missing, you can open an issue stating the problem sentence and desired result. If code is unclear give me a @mention. Pull requests are welcome.
