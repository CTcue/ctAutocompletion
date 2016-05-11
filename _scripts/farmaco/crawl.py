#!/usr/bin/env python
# -*- coding: utf-8 -*-
import urllib2
from bs4 import BeautifulSoup
import re
import requests
import json
import hashlib


def clean(term):
    term = re.sub("\([^\)]+\)", "", term)
    term = re.sub("in ((niet[ -])?gepegyleerde )?liposomen", "", term)
    return term.strip()


def dictify(ul, parent=None):
    result = {***REMOVED***

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


def find_cui(term, lookup_url="http://localhost:4080/term_lookup"):
    try:
        r = requests.post(lookup_url, data=json.dumps({"query": term***REMOVED***))
        result = r.json()
        return result["hits"][0]["cui"]
    except Exception, e:
        h = hashlib.sha1()
        h.update(term.encode("utf-8"))
        return h.hexdigest()


def unique_concepts(tree):
    result = set()
    for k, v in tree.iteritems():
        if isinstance(v, dict) and v:
            result |= unique_concepts(v)
        else:
            result.add(k)
    return result


def generate_concepts(tree, **kwargs):
    output = []
    for term in unique_concepts(tree):
        output.append( (find_cui(term, **kwargs), term) )

    return output


if __name__ == '__main__':
    url_pharma = "https://www.farmacotherapeutischkompas.nl/bladeren-volgens-boek"

    html = urllib2.urlopen(url_pharma).read()
    soup = BeautifulSoup(html, "lxml")

    for li in  soup.find("li", {'id': "geneesmiddelen"***REMOVED***):
        for ul in li.find_all("ul", recursive=False):
            result = dictify(ul)
            break

    # Output
    for (CUI, term) in generate_concepts(result):
        out = "|".join([CUI, term, "DUT", "farma_compas"])
        print out.encode("utf-8")