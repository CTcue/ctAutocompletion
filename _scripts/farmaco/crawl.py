#!/usr/bin/env python
# -*- coding: utf-8 -*-
import urllib2
import requests
from bs4 import BeautifulSoup
import unicodecsv as csv
import hashlib
import json
import time
import re
import os

basepath = os.path.dirname(__file__)


def stamp():
    return time.strftime("%Y-%m-%d %H:%M")


def clean(term):
    term = re.sub("\([^\)]+\)", "", term)
    term = re.sub("in ((niet[ -])?gepegyleerde )?liposomen", "", term)
    return term.strip()


def dictify(ul, parent=None):
    result = {}

    for li in ul.find_all("li", recursive=False):
        key = next(li.stripped_strings)

        if key == parent:
            continue

        # Check for nested list
        ul = li.find("ul")
        if ul:
            # If it's not empty, save it
            tmp = dictify(ul, key)
            if tmp:
                result[clean(key)] = tmp
        else:
            # Leaf found
            # Some leafs are actually combinations, seperated by a "/"
            cleaned = clean(key)

            if not "-" in cleaned:
                for term in [t.strip() for t in clean(key).split("/") if t.strip()]:
                    result[term] = None
            else:
                result[cleaned] = None

    return result

def sha1(term):
    h = hashlib.sha1()
    h.update(term.lower().encode("utf-8"))
    return h.hexdigest()


def find_cui(term, lookup_url="http://localhost:4080/term_lookup"):
    try:
        r = requests.post(lookup_url, data=json.dumps({"query": term}))
        result = r.json()
        return result["hits"][0]["cui"]
    except Exception, e:
        h = hashlib.sha1()
        h.update(term.lower().encode("utf-8"))
        return h.hexdigest()


def unique_concepts(tree):
    result = set()

    for k, v in tree.iteritems():
        if isinstance(v, dict) and v:
            result.add(k)
            result |= unique_concepts(v)
        else:
            result.add(k)
    return result


# Given nested dicts, return (unique) flattened list of tuples: (CUI, Term)
def generate_concepts(tree, **kwargs):
    return [(find_cui(t, **kwargs), t) for t in unique_concepts(tree)]

def generate_fake_concepts(tree, **kwargs):
    return [(sha1(t), t) for t in unique_concepts(tree)]

def concepts_to_lookup(concepts):
    return { v:k for (k, v) in concepts }

def unique_terms(tree, **kwargs):
    return [t for t in unique_concepts(tree)]

def generate_relations(tree, lookup, parent=None):
    relations = []

    for k, v in tree.iteritems():
        if isinstance(v, dict) and v:
            parentCui = lookup[k]
            relations.append((parentCui, "parent", parentCui))
            relations += generate_relations(v, lookup, parentCui)

        if parent:
            relations.append((lookup[k], "child", parent))

    return relations

def crawl_farma(url_pharma="https://www.farmacotherapeutischkompas.nl/bladeren-volgens-boek"):
    html = urllib2.urlopen(url_pharma).read()
    soup = BeautifulSoup(html, "lxml")

    # Parse list(s) recursive to convert farma_kompas page to a dict
    for li in  soup.find("li", {'id': "geneesmiddelen"}):
        for ul in li.find_all("ul", recursive=False):
            return dictify(ul)




if __name__ == '__main__':
    print "[%s]  Begin crawl." % stamp()

    farma_dict = crawl_farma()
    concepts   = generate_concepts(farma_dict)


    # Output concepts for autocompletion
    outpath = "../additional_terms/mapped_farmaco.csv"
    with open(os.path.join(basepath, outpath), "wb") as outf:
        w = csv.writer(outf, delimiter="|", encoding = "utf-8")

        for (CUI, term) in concepts:
            w.writerow([CUI, term, "DUT", "farma_compas", "Y"])


    print "[%s]  Build relations." % stamp()

    # Output for neo4j
    lookup     = concepts_to_lookup(concepts)
    relations  = generate_relations(farma_dict, lookup)

    outpath = "../output/farmaco_relations.txt"
    with open(os.path.join(basepath, outpath), "wb") as outf:
        w = csv.writer(outf, delimiter="\t", encoding = "utf-8")

        for (CUI1, rel, CUI2) in relations:
            w.writerow([CUI1, rel, CUI2])


    print "[%s]  Done." % stamp()