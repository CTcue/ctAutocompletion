Differences
===========

To compare for new and missing values easily:


1) Run two files you want to compare againt the getCUI script. For example:

```
less ../output/concepts_old.txt | node getCUI.js > old_cui.txt
less ../output/concepts_new.txt | node getCUI.js > new_cui.txt
```

2) Obtain insights in the differences with:

```
diff -y -W 120 old_cui.txt new_cui.txt > diffences.txt
```


3) (TODO) : Do a lookup given the list of differences, so you can check/verify what is added or missing
