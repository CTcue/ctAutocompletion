ctAutocompletion
================

Find relevant UMLS terms based on user input. The autocompletion algorithm prioritizes exact matches, and if non are found it prefers prefix matches. You can also send multiple words and for each separate term it does a prefix lookup, so you can send queries like `anky spondy` or `maj dep dis`.

## Installation

* Make sure you have NodeJS (>5.x) and Elasticsearch (>2.x) installed
  * Check if elasticsearch running

* In this directory install the dependencies with:
    * Run `npm install`
    * Run `pip install -r requirements.txt`

* Obtain a copy of our processed `output` directory:
    * Either download (the private) `output` directory from our [https://zoomholding.stackstorage.com/](https://zoomholding.stackstorage.com/)
    * Otherwise, download UMLS and run the pre-process scripts

* Put the `output` directory in `ctAutocompletion/_scripts/`
* Finally, run `bash ./_scripts/bulkUpload.sh`


#### Running the Demo

Open a terminal and inside this directory run:

```
npm start
```

* Open another terminal to serve the demo application and inside this directory run:

```
npm run serve
```

> The ctAutocompletion API will be running on `http://localhost:4080` and the demo application will be available on `http://localhost:4040`


###### Notes

* Make sure elasticsearch is running:
    * Check your directory `~/elasticsearch-[version]/bin`
    * Start the service with `./elasticsearch`  (or click the .bat)

* Neo4j is only required to obtain sibling/child/brand information about concepts


## Is it working?

If the app is running, you could use the following python script to send a test query:

```
import requests

url = "http://localhost:4080/expand-grouped"

response = requests.request("POST", url, json={ "query": "C0202117" })

print(response.text)
```

## API

Response and Request bodies are always in JSON.

Type | URL | Description |
---  | ------- | ----- |
`POST` | `/v2/autocomplete` | Find terms and suggestions by partial input |
`POST` | `/term_lookup`     | Find an exact term
`POST` | `/expand-grouped`  | Get all synonyms from a CUI
`POST` | `/expand-by-string` | Get all synonyms based on a term
`GET`  | `/dbc/:code`       | List all diagnosis for a DBC specialty code


#### `POST http://localhost:4080/v2/autocomplete`

```
{
    "query": "myo inf"
}
```

```
{
    "took": 11,
    "hits": [
        {
            "str": "Myocardial Infarction",
            "cui": "C0027051",
            "pref": "myocardinfarct"
        },
        {
            "str": "Myocardial inflammation",
            "cui": "C0027059",
            "pref": "Myocarditis"
        },
        {
            "str": "myopathie inflammatoir",
            "cui": "C0027121",
            "pref": "Myositis"
        },

        ...
    ]
}
```

#### `POST http://localhost:4080/term_lookup`

```
{
    "query": "LDL"
}
```

```
{
    "took": 0,
    "hits": [
        {
            "str": "ldl",
            "types": [
                "CHEM",
                "T123",
                "T109"
            ],
            "cui": "C0023823",
            "pref": "Low-Density Lipoproteins",
            "exact": "ldl"
        }
    ]
}
```

#### `POST http://localhost:4080/expand-grouped`

```
{
    "query": "C1306459"
}
```

```
{
    "category": "keyword",
    "pref": "Primary malignant neoplasm",
    "terms": {
        "english": [
            "Cancer",
            "Malignancy",
            "Tumor, malignant",
            "Cancer morphology",
            "Malignant neoplasm",
            "Primary malignant neoplasm",
            "Malignant tumor morphology",
            "Unclassified tumor, malignant",
            "Malignant neoplasm, primary (morphologic abnormality)"
        ]
    }
}
```

#### `POST http://localhost:4080/expand-by-string`

```
{
    "query": "Bechterew"
}
```

```
{
    "cui": "C0038013",
    "pref": "Ziekte van Marie-Strümpell",
    "terms": {
        "dutch": [
            "Bechterew",
            "Marie-Strümpell",
            "Ziekte van Bechterew",
            "reumatoïd spondylitis",
            "spondylitis reumatoïd",
            "Reumatoïde spondylitis",
            "spondylitis ankyloserend",
            "ankyloserend spondylitis",
            "Spondylitis ankylopoetica",
            "Ziekte van Marie-Strümpell",
            "spondylitis ankylopoietica",
            "ankylopoietica spondylitis",
            "spondylitis Marie-Strümpell",
            "Marie-Strümpell spondylitis",
            "Spondylarthritis ankylopoetica"
        ],
        "english": [
            "Bechterew Disease",
            "Ankylosing spondylitis",
            "Rheumatoid Spondylitis",
            "Marie-Struempell Disease",
            "Spondylitis Ankylopoietica",
            "Ankylosing Spondylarthritis",
            "Marie-Strumpell spondylitis",
            "Ankylosing Spondyloarthritis",
            "Rheumatoid arthritis of spine",
            "Spondylarthritis Ankylopoietica",
            "Spondyloarthritis Ankylopoietica",
            "Idiopathic ankylosing spondylitis"
        ]
    }
}
```


#### `GET http://localhost:4080/dbc/0320`

Where the `/:code` used is a DBC specialty code.

```
[
    {
        "label": "Traject",
        "number": "000"
    },
    {
        "label": "geen aanwijzingen voor cardiale afwijkingen",
        "number": "01"
    },
    {
        "label": "PODB, mogelijk AP",
        "number": "02"
    },
    {
        "label": "AP, nog geen ischemie aangetoond",
        "number": "03"
    },
    {
        "label": "AP, ischemie aangetoond",
        "number": "04"
    },

    ...
]
```

## Contributing

You can run unit tests with `npm test`.

If you feel something is missing, you can open an issue stating the problem sentence and desired result. If code is unclear give us a @mention. Pull requests are welcome.
