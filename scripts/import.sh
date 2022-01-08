#!/bin/sh

set -e

# Before you import:
# * Add your file `./output/concepts.txt`
# * Add elasticsearch credentials in `./config/local_config.json` (optional)

SCRIPTDIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

# Create the autocompletion index
(cd $SCRIPTDIR && node es-mapping.js)

# Bulk insert documents into Elasticsearch
(cd $SCRIPTDIR && less ./output/concepts.txt | node es-data-import.js $*)
