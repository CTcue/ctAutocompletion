#!/bin/bash

set -e

# Get (cross OS) path to the script dir
SCRIPTDIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )


python "$SCRIPTDIR/clear_elasticsearch.py" --src AUTOCOMPLETE $*

# Bulk insert processed documents into Elasticsearch
less "$SCRIPTDIR/output/concepts.*" | node "$SCRIPTDIR/elasticsearch.js" $*
