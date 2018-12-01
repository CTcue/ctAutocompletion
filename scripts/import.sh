#!/usr/bin/env bash

set -e

SCRIPTDIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

# Create the autocompletion index
(cd $SCRIPTDIR && node es-mapping.js)

# Read all concepts and bulk upload them to Elasticsearch
(cd $SCRIPTDIR && less ./output/*.txt | node elasticsearch.js $*)
