Scripts
=======

Generate, process and UMLS concepts into Elasticsearch.


## Building from scratch

If you don't have a copy of the `output` directory, you can generate the `processed` files yourself too!



#### Downloading UMLS sources

* Login and get accepted for an NLM account
* Download the UMLS Full Release Files [download link](https://www.nlm.nih.gov/research/umls/licensedcontent/umlsknowledgesources.html)
* It contains the following, but the actual contents are in the `mmsys.zip` folder.

```
2015AA.CHK
2015AA.MD5
2015AA-1-meta.nlm
2015AA-2-meta.nlm
2015AA-otherks.nlm
mmsys.zip
Copyright_Notice.txt
README.txt
```

* Extract the contents of `mmsys.zip` to obtain the UMLS .RRF files (they are like csv's)
* Place all downloads into this directory. **Including mmsys.zip itself!** (so the hash can be verified)
* Go into the directory and activate `run_linux.sh` or `run.bat`
* Follow MetamorphoSys steps
* On the final step where it asks for `.prop` file use the `props/level_0.prop` or `props/all.prop` for instant configuration.
    * Level_0 contains far less terms
* Click Done > start creation process

> This will take quite some time


#### Building

* If you extracted all *.RRF files, then copy the `./[YEAR-AA]/META/` directory (it should at least contain MRCONSO.RRF and MRSTY.RRF)
* Adjust the `./generate.sh` script so all paths are correct (for example `./2015AA/META/*.RRF`)
* Run `generate.sh` to process UMLS and create the `./output` files

> This will take quite some time


## Output

* The `./output` directory contains:
    * `./output/concepts.txt` is a copy of MRCONSO + additional sources in combination with a type from MRSTY.
    * `./output/relations.txt` contains (useful) relations extracted from MRREL.

* `./additional_terms` contains extracted concepts from farmacompas (mapped_farmaco.csv).
* You can also put your own .csv file with concepts in there. It uses the following format:

```
CUI      | Name       | Language | Source       | PREF? | STY  |
---------|------------|----------|--------------|-------|------|
C0054836 | Carvedilol | DUT      | farma_compas | Y     |T200  |

```
