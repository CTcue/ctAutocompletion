#!/usr/bin/env bash

# Clear elasticsearch
python clear_elasticsearch.py --src DBC $*

python dbc_diagnosis.py --file ./dbc_data/04_REF_DGN.csv $*
python dbc_treatments.py --file ./dbc_data/05_REF_ZPD.csv $*