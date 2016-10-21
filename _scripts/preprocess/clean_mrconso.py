# -*- coding: utf-8 -*-
import unicodecsv as csv
import os
import re
import time
import sys
from normalize import normalize
from skip_term import skip_term
from tqdm import *


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

basepath = os.path.dirname(__file__)


def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


if __name__ == '__main__':


    print "[%s]  Starting MRCONSO cleaning." % stamp()

    consoPath = os.path.join(basepath, "..", "2015AA", "META", "MRCONSO.RRF")

    with open(os.path.join(basepath, "..", "cleaned_terms", "CLEAN_MRCONSO.RRF"), "wb") as out_file:
        writer = csv.writer(out_file, encoding="utf-8", delimiter=str("|"))

        try:
            # Read input from MRCONSO and skip unneeded rows
            with open(consoPath, "rb") as in_file:
                datareader = csv.reader(in_file, encoding="utf-8", delimiter=str("|"))

                for line in  tqdm(datareader):
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
        except:
            print "\n\tMRCONSO.rrf not found at %s." % consoPath
            sys.exit(1)

    print "[%s]  Done." % stamp()
