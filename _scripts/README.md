
# Building from scratch

1. Download UMLS
2. Extract *.RRF files
3. Run `preprocess.py`
    3a. It prompts for file location of UMLS data (MRCONSO, MRSTY, MRREL)
    3b. It prompts for additional_term location (ie. custom terms mapped with a CUI)

Preprocess is used to create copies of MRCONSO (+ alternative sources if needed), MRSTY and MRREL. The copies contain only CUI's that are preferred and in useful groups and categories (ie not Food). In addition, obsolete CUI's are removed. It then outputes 2 files:

    * `concepts.txt`  CUI, Lat, Pref, Types, Terms
    * `relations.txt` CUI1, REL, CUI2

