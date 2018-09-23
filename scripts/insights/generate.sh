#!/usr/bin/env bash

SCRIPTDIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

set -e

# Pipes all *.log files through the logparser
(cd $SCRIPTDIR && less ./data/*.log | node logparser.js)
