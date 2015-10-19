ctAutocompletion
=======

### Autocompletion

Find relevant UMLS terms based on user input.


```
curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "Major dep"
}'

// Results in

{
  "took": 2,
  "hits": [
    {
      "str": "Major depression",
      "cui": "C1269683",
      "score": 9.811963
    },
    {
      "str": "major depressive disorder",
      "cui": "C1269683",
      "score": 7.8495703
    },
    {
      "str": "major depressive illness",
      "cui": "C1269683",
      "score": 7.8495703
    },

    ...
}
```



### Synonym browsing

Obtain all umls synonyms for a given CUI code.


```
curl -XPOST 178.62.230.23/autocomplete -d '{
    "query" : "C1269683"
}'

// Results in

[
  "Depressieve stoornis, ernstige",
  "Ernstige depressieve stoornis",
  "Involutiepsychose",
  "involutionele Melancholie",
  "involutionele Parafrenie",
  "involutionele Psychose",
  "Involutiedepressie",
  "Involutionele depressie",
  "major depressive disorder",
  "Depressive Disorder, Major"
]
```
