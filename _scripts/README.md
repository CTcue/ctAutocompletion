Scripts
=======

Generate, process and UMLS concepts into Elasticsearch.


## Building from scratch

If you don't have a copy of the `output` directory, you can generate the `processed` files yourself too!


1. Download UMLS
2. Extract all *.RRF files, then copy the `./[YEAR-AA]/META/` directory (it should at least contain MRCONSO.RRF and MRSTY.RRF)
3. Adjust the `./generate.sh` script so all paths are correct (for example `./2015AA/META/*.RRF`)
4. Run `generate.sh`

> This will take quite some time


## Output

* The `./output` directory contains the `processed` files:
    * `./output/concepts.txt` is a copy of MRCONSO + additional sources in combination with a type from MRSTY.
    * `./output/relations.txt` contains (useful) relations extracted from MRREL.

* `./additional_terms` contains extracted concepts from farmacompas (mapped_farmaco.csv).
* You can also put your own .csv file with concepts in there. It uses the following format:

```
CUI      | Name       | Language | Source       | PREF? | STY  |
---------|------------|----------|--------------|-------|------|
C0054836 | Carvedilol | DUT      | farma_compas | Y     |T200  |

```