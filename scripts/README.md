
Bulk upload
===========

You can run the upload script by passing the UMLS directory with `*.rrf` files as `--dir` argument:
```
python bulk_upload.py --dir 2015AA/Meta/
```


### MRCONSO

i. Column  Description

0. CUI Unique identifier for concept
1. LAT Language of term
2. TS  Term status
3. LUI Unique identifier for term
4. STT String type
5. SUI Unique identifier for string
6. ISPREF  Atom status - preferred (Y) or not (N) for this string within this concept
7. AUI Unique identifier for atom - variable length field, 8 or 9 characters
8. SAUI  Source asserted atom identifier [optional]
9. SCUI  Source asserted concept identifier [optional]
10. SDUI  Source asserted descriptor identifier [optional]

11. SAB Abbreviated source name (SAB).  Maximum field length is 20 alphanumeric characters.  Two source abbreviations are assigned:
Root Source Abbreviation (RSAB) — short form, no version information, for example, AI/RHEUM, 1993, has an RSAB of "AIR"
Versioned Source Abbreviation (VSAB) — includes version information, for example, AI/RHEUM, 1993, has an VSAB of "AIR93"
Official source names, RSABs, and VSABs are included on the Source Vocabularies page.

12. TTY Abbreviation for term type in source vocabulary, for example PN (Metathesaurus Preferred Name) or CD (Clinical Drug). Possible values are listed on the Abbreviations Used in Data Elements page.

13. CODE  Most useful source asserted identifier (if the source vocabulary has more than one identifier), or a Metathesaurus-generated source entry identifier (if the source vocabulary has none)
14. STR String
15. SRL Source restriction level

16. SUPPRESS  Suppressible flag. Values = O, E, Y, or N

  O: All obsolete content, whether they are obsolesced by the source or by NLM. These will include all atoms having obsolete TTYs, and other atoms becoming obsolete that have not acquired an obsolete TTY (e.g. RxNorm SCDs no longer associated with current drugs, LNC atoms derived from obsolete LNC concepts).

  E: Non-obsolete content marked suppressible by an editor. These do not have a suppressible SAB/TTY combination.
  Y: Non-obsolete content deemed suppressible during inversion. These can be determined by a specific SAB/TTY combination explicitly listed in MRRANK.
  N: None of the above


### MRSTY

i. Column    Description
0. CUI Unique identifier of concept
1. TUI Unique identifier of Semantic Type
2. STN Semantic Type tree number
3. STY Semantic Type. The valid values are defined in the Semantic Network.
4. ATUI    Unique identifier for attribute
5. CVF Content View Flag. Bit field used to flag rows included in Content View. This field is a varchar field to maximize the number of bits available for use.



## Checks

After bulk uploading the data, check if following returns the desired results

Query | Relevant result
------|------------------------------
Diabetes mel | Diabetes Mellitus
Swolle -> Swollen | Swollen Joint(s)
Anky spondy | Ankylosing spondylitis
Myocard inf | Myocardial Infarct
Hyperten | Hypertensie
Niet klein | Niet kleincellig longcarcinoom
LDL | Low density lipoprotein cholesterol measurement