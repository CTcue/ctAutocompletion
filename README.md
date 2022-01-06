ctAutocompletion
================

Finds relevant medical terms and their synonyms using Elasticsearch.

* Optimized for the medical domain
* Prioritizes exact and/or prefix matches.
* Fallback fuzzy search

## Installation

* Make sure you have NodeJS (latest LTS) and Elasticsearch (7.x) installed
* In this directory install the dependencies with:

```
yarn install
```

* Either obtain a copy of our processed `output` directory or create your own file
    * `ai-data > synonym-files > autocompletion_concepts.txt`
    * See below [for an example of the file format](#format-concepts)

* Put the `output` directory in `./scripts/` so you have a `./scripts/output/concepts.txt`

* To get an elasticsearch index with terms:

```
cd scripts

bash import.sh
```

> It will take a few minutes to upload all the terms to the index

## Running demo

To compare autocompletion results (side by side) with another instance of synonyms.

For the main app, open a terminal and run:

```
yarn start
```

* Open another terminal to serve the demo application run:

```
yarn run serve
```

> The ctAutocompletion API will be running on `http://localhost:4080` and the demo application will be available on `http://localhost:4040`


## Testing

* Make sure elasticsearch is running and has an `autocomplete` index

```
yarn run test
```

## API

Response and request bodies are in JSON.

Type | URL | Description |
---  | ------- | ----- |
`POST` | `/v2/autocomplete`  | Find terms and suggestions by partial input |
`POST` | `/expand`           | Find an exact term
`POST` | `/expand-grouped`   | Get all synonyms from a CUI
`POST` | `/expand-by-string` | Get all synonyms based on a term


#### `POST http://localhost:4080/v2/autocomplete`

```
{
    "query": "myo inf"
}
```

```
response
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

#### `POST http://localhost:4080/expand-grouped`

```
{
    "query": "C1306459"
}
```

```
response
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
response
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

## Format concepts

You can add your own concepts via a tab separated file (concepts.txt), that contains the cui, language, source, type, preferred term and synonyms:

CUI (id) | Language | Source | Type | Preferred term | Synonyms |
-------- | -------- | ------ | ---- | -------------- | ---------- |
C0001969 |   DUT    | `ICPC2ICD10DUT` | `T048|DISO` | alcoholintoxicatie | `Alcohol Gebruik|Alcoholabuses` |
C0011860 |   DUT    | `MSHDUT|ICD10DUT|MDRDUT` | ` DISO|T047` | Diabetes Mellitus Type 2 | `Diabetes Mellitus Type 2|Niet-insuline-afhankelijke Diabetes Mellitus|DM2`

## Contributing

You can run tests with `yarn run test`.

If you feel something is missing, you can open an issue stating the problem sentence and desired result. If code is unclear give us a @mention. Pull requests are welcome.
