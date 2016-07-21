ctAutocompletion
=======

Find relevant UMLS terms based on user input. The autocompletion algorithm prioritizes exact matches, and if non are found it prefers prefix matches. You can also send multiple words and for each seperate term it does a prefix lookup, so you can send queries like `anky spondy` or `maj dep dis`.


## Installation

* Make sure you have NodeJS (>5.x) and Elasticsearch (>2.x) installed
  * Check if elasticsearch running
  * Optionally you can install Neo4j
* Run `npm install`
* Run `pip install -r requirements.txt`
* Download the `output` directory from our [https://zoomholding.stackstorage.com/](https://zoomholding.stackstorage.com/)
* Place the `output` directory in `ctAutocompletion/_scripts/`
* Run `bash ./_scripts/bulkUpload.sh`

You can now run `npm start` or `node app.js` to start your local ctAutocompletion server on http://localhost:4080 by default.


## Contributing

You can run unit tests with `npm test`.

If you feel something is missing, you can open an issue stating the problem sentence and desired result. If code is unclear give me a @mention. Pull requests are welcome.
