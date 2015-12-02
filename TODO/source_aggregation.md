
Potential:

Dropdown to select/autocomplete (or even expand) only from specific sources.


{
        "_source": false,
        "size": 0,
        "aggs" : {
            "sources" : {
                "terms" : { "field" : "source", "size": 100 }
            }
        }
}