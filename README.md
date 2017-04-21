ctAutocompletion
================

Find relevant UMLS terms based on user input. The autocompletion algorithm prioritizes exact matches, and if non are found it prefers prefix matches. You can also send multiple words and for each seperate term it does a prefix lookup, so you can send queries like `anky spondy` or `maj dep dis`.


## ctAutocompletion locally


#### Installation

* Make sure you have NodeJS (>5.x) and Elasticsearch (>2.x) installed
  * Check if elasticsearch running
  * Optionally you can install Neo4j (**NOTE** Without it, the app notifies you Neo4j is off, but that is ok if you only need it for `term_lookup`)

* In this directory install the dependencies with:
    * Run `npm install`
    * Run `pip install -r requirements.txt`

* Obtain a copy of our processed `output` directory:
    * Either download (the private) `output` directory from our [https://zoomholding.stackstorage.com/](https://zoomholding.stackstorage.com/)
    * Otherwise, download UMLS and run the pre-process scripts

* Put the `output` directory in `ctAutocompletion/_scripts/`
* Finally, run `bash ./_scripts/bulkUpload.sh`


#### Start the app

Inside this directory run:

```
node app.js
```

> ctAutocompletion will be running on `http://localhost:4080` by default


###### Notes

* Make sure elasticsearch is running:
    * Check your directory `~/elasticsearch-[version]/bin`
    * Start the service with `./elasticsearch`  (or click the .bat)

* Neo4j is only required to obtain sibling/child/brand information about concepts



## Is it working?

If the app is running, you could (for example) use the following python script to send a test query:

```
import requests

url = "http://localhost:4080/expand-grouped"

response = requests.request("POST", url, json={ "query": "C0202117" ***REMOVED***)

print(response.text)
```


## Contributing

You can run unit tests with `npm test`.

If you feel something is missing, you can open an issue stating the problem sentence and desired result. If code is unclear give us a @mention. Pull requests are welcome.
