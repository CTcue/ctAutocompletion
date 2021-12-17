#!/bin/sh

set -e

#
# Usage:
#
#   bash import.sh --elastic username:password
#
#
# Note:
#
#   Make sure you added the latest synonyms
#   in the `./output` directory
#

SCRIPTDIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

# Create the autocompletion index
(cd $SCRIPTDIR && node es-mapping.js)

# Bulk insert documents into Elasticsearch
(cd $SCRIPTDIR && less ./output/concepts.txt | node es-data-import.js $*)
