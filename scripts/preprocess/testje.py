# -*- coding: utf-8 -*-

import dill
import pickle

from body_parts import is_bodypart
import csv
from collections import defaultdict


def main():
    counter = 0

    with open("umls.pickle", 'rb') as f:
        resultDict = dill.load(f)
        filename = "concepts.txt"

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


if __name__ == "__main__":
    main()
