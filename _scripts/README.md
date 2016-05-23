ctAutocompletion
=================


The easiest way to use ctAutocompletion is to:

1. Download the `preprocessed` files. (link)
2. Extract these files into the `./output` directory
3. Run `bulkUpload.sh --user=neo4-user --password=neo4j-password`


## Building from scratch

You can generate the `preprocessed` files yourself too!

1. Download UMLS
2. Extract all *.RRF files
3. Adjust `generate.sh` script so all paths are correct (ie `./2015AA/META/*.RRF`)
4. Run `generate.sh` (this will take quite some time)

Now the `./output` directory contains the `preprocessed` files and is ready for use. `output/concepts.txt` is a copy of MRCONSO + additional sources in combination with a type from MRSTY. `output/relations.txt` has all useful relations extracted from MRREL.

