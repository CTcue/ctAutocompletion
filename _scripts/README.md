ctAutocompletion Building from scratch
=================

You can generate the `preprocessed` files yourself too!

1. Download UMLS
2. Extract all *.RRF files
3. Adjust `generate.sh` script so all paths are correct (ie `./2015AA/META/*.RRF`)
4. Run `generate.sh` (this will take quite some time)

Now the `./output` directory contains the `preprocessed` files and is ready for use. `output/concepts.txt` is a copy of MRCONSO + additional sources in combination with a type from MRSTY. `output/relations.txt` has all useful relations extracted from MRREL.

