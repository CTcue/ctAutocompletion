# -*- coding: utf-8 -*-
import csv
import os
import re
import time
import sys
from normalize_fn import normalize
from skip_term import skip_term


obsolete_types = ['N1', 'PM', 'OAS', 'OAF', 'OAM', 'OAP', 'OA', 'OCD', 'OET', 'OF', 'OLC', 'OM', 'ONP', 'OOSN', 'OPN', 'OP', 'LO', 'IS', 'MTH_LO', 'MTH_IS', 'MTH_OET']
useful_sources = [
    "MSH",
    "SNOMEDCT_US",
    # "LNC",
    "RXNORM",
    "MEDCIN",
    "MTH",
    "NCI",
    "ICPC2ICD10DUT",
    "MDRDUT",
    "MSHDUT",
    "MDR",
    "ICD10DUT",
    "ICD10"
]

fileDir = os.path.abspath(os.pardir)

def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


if __name__ == '__main__':
    print("[%s]  Starting MRCONSO cleaning." % stamp())

    consoPath = os.path.join(fileDir, "2015AA", "META", "MRCONSO.RRF")

    with open(os.path.join(fileDir, "cleaned_terms", "CLEAN_MRCONSO.RRF"), "w", newline='', encoding='utf-8') as out_file:
        writer = csv.writer(out_file, delimiter=str("|"))

        datareader = csv.reader(open(consoPath, "r", newline="", encoding='utf-8'), delimiter="|")

        for line in datareader:
            (CUI, LAT, TS, LUI, STT, SUI, ISPREF, AUI, SAUI, SCUI, SDUI, SAB, TTY, CODE, STR, SRL, SUPPRESS, CVF, _) = line

            # Language
            if LAT not in ['ENG', 'DUT']:
                continue

            if ISPREF != 'Y' or STT != "PF" or TS not in ["P", "S"]:
                continue

            if SUPPRESS != "N":
                continue

            # Obsolete sources
            if TTY in obsolete_types:
                continue

            if SAB not in useful_sources:
                continue

            normalized = normalize(STR)
            if skip_term(normalized):
                continue

            writer.writerow([CUI, normalized, LAT, SAB, TS])

    print("[%s]  Done." % stamp())
