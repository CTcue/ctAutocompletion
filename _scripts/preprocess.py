#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from elasticsearch import Elasticsearch, helpers
from mrjob.job import MRJob
import ConfigParser
import json
import time
import os


skip_categories = [
    "Age Group",
    "Temporal Concept",
    "Organism Attribute",
    "Intellectual Product",
    "Food",
    "Plant",
    "Mammal",
    "Geographic Area",
    "Governmental or Regulatory Activity",
    "Health Care Related Organization",
    "Organization",
    "Patient or Disabled Group",
    "Population Group",
    "Qualitative Concept",
    "Quantitative Concept",
    "Regulation or Law",
    "Self-help or Relief Organization"
]


class AggregatorJob(MRJob):
    """
    Groups unique synonyms by CUI.
    Output format: (CUI, [STR, STR, ...])
    """

    def mapper(self, key, value):
        split = value.decode("utf-8").split("|")

        # MRCONSO Header
        if len(split) == 19:
            (CUI, LAT, TS, LUI, STT, SUI, ISPREF, AUI, SAUI, SCUI, SDUI, SAB, TTY, CODE, STR, SRL, SUPPRESS, CVF, _) = split

            if len(STR) > 32:
                return

            if ISPREF != 'Y':
                return

            # Language
            if LAT not in ['ENG', 'DUT']:
                return

            # Obsolete sources
            if TTY in ['N1','PM', 'OAS','OAF','OAM','OAP','OA','OCD','OET','OF','OLC','OM','ONP','OOSN','OPN','OP','LO','IS','MTH_LO','MTH_IS','MTH_OET']:
                return

            if SAB in ["CHV","PSY","ICD9","ICD9CM","NCI_FDA","NCI_CTCAE","NCI_CDISC","ICPC2P","SNOMEDCT_VET"]:
                return

            # Skip records such as Pat.mo.dnt
            if STR.count(".") >= 3 or STR.count(":") >= 3:
                return

            yield CUI, ["A", STR]

        # Additional Terms header
        elif len(split) == 5:
            (CUI, STR, LAT, SAB, _) = split

            yield CUI, ["A", STR]

        # MRSTY Header
        elif len(split) == 7:
            (CUI, TUI, STN, STY, ATUI, CVF, _) = split

            yield CUI, ["B", STY]
        else:
            pass


    def reducer(self, key, values):
        terms = set()
        types = set()

        for value in values:
            if value[0] == "A":
                terms.add(value[1])
            elif value[0] == "B":
                types.add(value[1])

        if not terms or not types:
            return

        # Check types
        if any((x for x in types if x in skip_categories)):
            return

        out = "%s\t%s\t%s" % (key, "|".join(types), "|".join(terms))
        print out.encode("utf-8")


def absPath(*path):
    basepath = os.path.dirname(__file__)
    return os.path.abspath(os.path.join(basepath, *path))

def isFile(*path):
    return os.path.isfile(absPath(*path))


if __name__ == "__main__":

    # Read default config file
    config = ConfigParser.ConfigParser()
    config.readfp(open('config.cfg'))


    # _auth = ("", "")
    # index = "autocomplete2"

    # try:
    #     basepath = os.path.dirname(__file__)
    #     config_filename = os.path.abspath(os.path.join(basepath, "..", "..", "ctcue-config", "local_elasticsearch_shield.json"))

    #     with open(config_filename) as config:
    #         _config = json.load(config)
    #         _auth   = _config["_shield"].split(":")

    # except Exception as err:
    #     # print err
    #     pass

    # Check if local config file exists
    if not isFile("./local_config.cfg"):
        print "No local config file found. Let's make one:"

        # Check for UMLS terms
        if not isFile(config.get("data_directories", "umls"), "MRCONSO.RRF"):
            _dir = raw_input("Where is your UMLS directory?\n[UMLS_DIR] ")
            config.set('data_directories', "umls", _dir)

        print "\n\t- UMLS data directory set to %s" % config.get("data_directories", "umls")


        # Check additional terms
        if not isFile(config.get("data_directories", "additional_terms"), "mapped_customctcue_terms.csv"):
            _dir = raw_input("Do you have an additional_terms directory?\n[TERMS_DIR] ")
            config.set('data_directories', "additional_terms", _dir)

        print "\n\t- Additional terms directory set to %s" % config.get("data_directories", "additional_terms")



        # Write local config file
    else:
        config.read('local_config.cfg')
        print absPath(config.get("data_directories", "umls"))


    # elastic = Elasticsearch(http_auth=_auth)
    # elastic.indices.delete(index=index, ignore=[400, 404])
    # elastic.indices.create(index=index, body=json.load(open("../_mappings/autocomplete.json")))



    # AggregatorJob.run()
