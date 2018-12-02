#!/usr/bin/env bash

set -e

SCRIPTDIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

# Read new concepts and add them to Elasticsearch
(cd $SCRIPTDIR && less ./custom/*.tsv | node elasticsearch.js $*)
(cd $SCRIPTDIR && less ./custom/*.txt | node elasticsearch.js $*)
