# -*- coding: utf-8 -*-

import csv
import os
import re
import time
import sys

import dill
import pickle

from collections import defaultdict

from semantic import get_group
from body_parts import is_bodypart
from skip_term import skip_term
from normalize_fn import normalize

from gooey import Gooey, GooeyParser


@Gooey(program_name="Clean up MRCONSO.RRF")
def main():
    stored_args = {}
    parser = GooeyParser()

    parser.add_argument(
        "output_directory",
        action="store",
        widget="DirChooser",
        default=stored_args.get("output_directory"),
        help="Output directory for cleaned file",
    )

    args = parser.parse_args()
    filename = os.path.join(args.output_directory, "concepts.txt")

    with open("umls.pickle", 'rb') as f:
        resultDict = dill.load(f)

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
                sources = set()
                terms = defaultdict(set)
                preferred = defaultdict(list)

                # Include 'votes' to allow for small preference towards dutch
                # terms
                votes = 0

                for (term, SAB, PREF) in val["dutch"]:
                    sources.add(SAB)
                    terms["DUT"].add(term)

                    if len(term) > 4 and len(term) < 12:
                        votes += 0.05

                    if PREF:
                        votes += 1
                        preferred["DUT"].append(term)


                for (term, SAB, PREF) in val["english"]:
                    sources.add(SAB)
                    terms["ENG"].add(term)

                    if PREF:
                        preferred["ENG"].append(term)


                # Amount of sources that have terms for the term
                votes += len(sources) * 0.1

                if not terms:
                    continue

                for LAT, v in terms.items():
                    # Get unique terms per language
                    unique = { t.lower(): t for t in v }.values()

                    # Find preferred term
                    if "DUT" in preferred:
                        prefTerm = preferred["DUT"][0]
                    elif "ENG" in preferred:
                        prefTerm = preferred["ENG"][0]
                    else:
                        prefTerm = list(unique)[0]

                    writer.writerow([CUI, LAT, "|".join(sources), "|".join(combined_types), prefTerm, "|".join(unique), votes])


    print("Created file: %s/concepts.txt" % (args.output_directory))


if __name__ == "__main__":
    main()
