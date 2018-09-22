# -*- coding: utf-8 -*-

import csv
import os
import re
import time
import sys

# import dill
# import pickle

from collections import defaultdict

from semantic import get_group
from body_parts import is_bodypart
from skip_term import skip_term
from normalize_fn import normalize

from gooey import Gooey, GooeyParser


obsolete_types = [
    "N1",
    "PM",
    "OAS",
    "OAF",
    "OAM",
    "OAP",
    "OA",
    "OCD",
    "OET",
    "OF",
    "OLC",
    "OM",
    "ONP",
    "OOSN",
    "OPN",
    "OP",
    "LO",
    "IS",
    "MTH_LO",
    "MTH_IS",
    "MTH_OET",
]

useful_sources = [
    "MSH",
    "SNOMEDCT_US",
    "RXNORM",
    "MEDCIN",
    "MTH",
    "NCI",
    "ICPC2ICD10DUT",
    "MDRDUT",
    "MSHDUT",
    "MDR",
    "ICD10DUT",
    "ICD10",
]

skip_categories = [
    "Age Group",
    "Food",
    "Geographic Area",
    "Governmental or Regulatory Activity",
    "Health Care Related Organization",
    "Intellectual Product",
    "Mammal",
    "Organism Attribute",
    "Organization",
    "Patient or Disabled Group",
    "Plant",
    "Population Group",
    "Qualitative Concept",
    "Quantitative Concept",
    "Regulation or Law",
    "Self-help or Relief Organization" "Temporal Concept",
    "Educational Activity",
    "Research Activity",
    "Health Care Activity",
]


@Gooey(program_name="Clean up MRCONSO.RRF")
def main():
    stored_args = {}
    parser = GooeyParser()

    parser.add_argument(
        "mrconso_file",
        action="store",
        default=stored_args.get("mrconso_file"),
        widget="FileChooser",
        help="MRCONSO.RRF",
    )

    parser.add_argument(
        "mrsty_file",
        action="store",
        default=stored_args.get("mrsty_file"),
        widget="FileChooser",
        help="MRSTY.RRF",
    )

    # parser.add_argument(
    #     "output_directory",
    #     action="store",
    #     widget="DirChooser",
    #     default=stored_args.get("output_directory"),
    #     help="Output directory for cleaned file",
    # )

    args = parser.parse_args()

    # Join data of MRSTY & MRCONSO
    resultDict = defaultdict(lambda: {
        "category": set(),
        "types": set(),

        "dutch": [],
        "english": []
    })


    # Read data from MRSTY
    mrstyOpen = open(args.mrsty_file, "r", newline="", encoding="utf-8")
    mrstyReader = csv.reader(mrstyOpen, delimiter="|")

    for line in mrstyReader:
        (CUI, TUI, STN, STY, ATUI, CVF, _) = line

        if STY in skip_categories:
            continue

        group = get_group(TUI)

        if group:
            resultDict[CUI]["category"].add(group)
            resultDict[CUI]["types"].add(TUI)


    # Read data from MRCONSO
    mrconsoOpen = open(args.mrconso_file, "r", newline="", encoding="utf-8")
    mrconsoReader = csv.reader(mrconsoOpen, delimiter="|")

    for line in mrconsoReader:
        (
            CUI,
            LAT,
            TS,
            LUI,
            STT,
            SUI,
            ISPREF,
            AUI,
            SAUI,
            SCUI,
            SDUI,
            SAB,
            TTY,
            CODE,
            STR,
            SRL,
            SUPPRESS,
            CVF,
            _,
        ) = line

        # Language
        if LAT != "ENG" and LAT != "DUT":
            continue

        if ISPREF != "Y" or STT != "PF":
            continue

        if TS != "P" and TS != "S":
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

        if LAT == "ENG":
            resultDict[CUI]["english"].append([normalized, SAB, TS == "P"])
        else:
            resultDict[CUI]["dutch"].append([normalized, SAB, TS == "P"])



    # dill_file = open("umls.pickle", "wb")
    # dill_file.write(dill.dumps(resultDict))
    # dill_file.close()

    filename = os.path.join(args.output_directory, "concepts.txt")

    with open(filename, "w", newline="", encoding="utf-8") as out_file:
        writer = csv.writer(out_file, delimiter=str("\t"))

        for CUI, val in resultDict.items():
            combined_types = [t for t in val["category"] | val["types"] if t]

            if not combined_types:
                continue

            if not val["english"] and not val["dutch"]:
                continue

            if any(x for x in val["category"] if x in ["LIVB", "CONC", "ACTI", "GEOG", "OBJC", "OCCU", "DEVI", "ORGA"]):
                continue

            # All terms (by sources)
            terms = defaultdict(lambda: defaultdict(set))
            preferred = defaultdict(list)

            for (term, SAB, PREF) in val["dutch"]:
                terms["DUT"][SAB].add(term)

                if PREF:
                    preferred["DUT"].append(term)

            for (term, SAB, PREF) in val["english"]:
                terms["ENG"][SAB].add(term)

                if PREF:
                    preferred["ENG"].append(term)


            if not terms:
                continue


            for LAT, SAB_terms in terms.items():
                for SAB, v in SAB_terms.items():
                    # If ANATOMY category -> skip checking for anatomy terms
                    if not any(x for x in val["category"] if x == "ANAT"):
                        tmp_terms = set()

                        for t in v:
                            if not is_bodypart(t):
                                tmp_terms.add(t)
                        v = tmp_terms

                    # Get unique terms per language
                    unique = { t.lower(): t for t in v }.values()

                    if not unique:
                        continue

                    # Find preferred term
                    if "DUT" in preferred:
                        prefTerm = preferred["DUT"][0]
                    elif "ENG" in preferred:
                        prefTerm = preferred["ENG"][0]
                    else:
                        prefTerm = list(unique)[0]

                    writer.writerow([CUI, LAT, SAB, "|".join(combined_types), prefTerm, "|".join(unique)])


    # print("Done. Created file: %s/CLEAN_MRCONSO.RRF" % (args.output_directory))
    print("Done.")


if __name__ == "__main__":
    main()
