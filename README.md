ctAutocompletion
================

Find relevant UMLS terms based on user input. The autocompletion algorithm prioritizes exact matches, and if non are found it prefers prefix matches. You can also send multiple words and for each separate term it does a prefix lookup, so you can send queries like `anky spondy` or `maj dep dis`.

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

## Format concepts

You can add your own concepts via a tab separated file (concepts.txt), that contains the cui, language, source, type, preferred term and synonyms:

CUI (id) | Language | Source | Type | Preferred term | Synonyms |
-------- | -------- | ------ | ---- | -------------- | ---------- |
C0001969 |   DUT    | `ICPC2ICD10DUT` | `T048|DISO` | alcoholintoxicatie | `Alcohol Gebruik|Alcoholabuses` |
C0011860 |   DUT    | `MSHDUT|ICD10DUT|MDRDUT` | ` DISO|T047` | Diabetes Mellitus Type 2 | `Diabetes Mellitus Type 2|Niet-insuline-afhankelijke Diabetes Mellitus|DM2`

## Contributing

You can run unit tests with `yarn test`.

If you feel something is missing, you can open an issue stating the problem sentence and desired result. If code is unclear give us a @mention. Pull requests are welcome.
