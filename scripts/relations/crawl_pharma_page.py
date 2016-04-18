
import re
import urllib2
from bs4 import BeautifulSoup
from pprint import pprint
import unicodecsv as csv
import requests
import json

from itertools import groupby

url_pharma = "https://www.farmacotherapeutischkompas.nl/bladeren-volgens-boek"

def clean_result(result):
    for k, v in result.iteritems():
        if isinstance(v, dict):
            if any([isinstance(x,dict) for x in v.values()]):
                filtered = dict([(x,y) for x,y in v.iteritems() if isinstance(y,dict)])
                result[k] = clean_result(filtered)
            else:
                result[k] = [x for x,y in v.iteritems() if y=='pill']
    return result



def dictify(ul):
    result = {***REMOVED***
    for li in ul.find_all("li", recursive=False):
        key = next(li.stripped_strings)
        ul = li.find("ul")
        if ul:
            result[key] = dictify(ul)
        else:
            result[key] = li["class"][0]
    return result

def extract():

    print "get html"
    html = urllib2.urlopen(url_pharma).read()
    soup = BeautifulSoup(html, "html.parser")

    print "scraped"

    for li in  soup.find("li", {'id': "geneesmiddelen"***REMOVED***):

        for ul in li.findAll("ul"):

            result = dictify(ul)
            break

    pprint(result)
    result = clean_result(result)

    print list(result.keys())
    print "processed"

    results_to_file(result)

def results_to_file(result):
    with open("data/farmaco_terms.csv","wb")as outf:
        w = csv.writer(outf, delimiter="|",encoding = "utf-8")
        concept_count, concepts = to_file(w, result, 1, 0, [("Geneesmiddelen",0,None)])

    with open("data/farmaco_concepts.csv","wb")as outf:
        w = csv.writer(outf, delimiter="|",encoding = "utf-8")

        for elem in concepts:
            print elem
            w.writerow(elem)
    # pprint(result)




def to_file(w, result, i, prev_concept, concepts):
    for k,v in result.iteritems():
        concept_id = i
        print "concept_id", concept_id
        c = (k,i,prev_concept)
        print "add concept", c
        concepts.append(c)

        print "value of concept =", v, type(v)
        if isinstance(v,dict):
            print "new concept"
            i, concepts = to_file(w,v,i=i+1, prev_concept=concept_id, concepts=concepts)
        elif isinstance(v,list):
            print "leafs reached"
            terms = clean_terms(v)
            for t in terms:
                print "add term",t, i
                w.writerow((t, i))
            i+=1

    return i, concepts


def clean_terms(terms):
    cleaned = []
    for t in terms:
        t = re.sub("\([^\)]+\)","",t)
        t = re.sub("in ((niet[ -])?gepegyleerde )?liposomen","")
        cleaned.extend(t.split("/"))
    cleaned = list(set([c.strip() for c in cleaned]))
    cleaned.sort()
    return cleaned


url = "http://localhost:4080/term_lookup"
def check_via_autocomplete(term):
    try:
        data = {"query":term***REMOVED***
        r = requests.post(url, data=json.dumps(data))
        result = r.json()
        return result["hits"]
    except Exception, e:
        print("lookup fail")
        print(e)
        print term
        return None

def map_terms():
    cust_termid = 1
    custom_concepts = {***REMOVED***
    line_nr = 0

    with open("data/farmaco_mapped_terms.csv", "wb") as outf:
        w = csv.writer(outf, delimiter="|", encoding="utf-8")

        # for r in read_rows("data/farmaco_terms.csv", header = ["term","pharma_concept"]):
        for r in [{"term":"risedroninezuur","pharma_concept":2***REMOVED***]:
            line_nr+=1
            print "\nline_nr", line_nr

            hits = check_via_autocomplete(r["term"])
            print hits

            mapped = False

            while not mapped:

                if len(hits)==1 and hits[0]["exact"]==r["term"].lower():
                    print "exact match", [hits[0]["cui"]]+"-", hits
                    r["cui"] = [hits[0]["cui"]]
                    mapped = True

                if len(hits)>1 and not mapped and all([h["exact"]==r["term"].lower() for h in hits]):
                    r["cui"] = list(set([h["cui"] for h in hits]))
                    print "all_true", r["cui"]
                    mapped = True

                if len(hits)>2 and not mapped:
                    temp = hits[0]["cui"]
                    if all(h["cui"]==temp for h in hits[1:]) and any(h["exact"]==r["term"] for h in hits):
                        r["cui"]=[temp]
                        mapped = True

                if not mapped:
                    print r["term"]
                    for i,h in enumerate(hits):
                        rel_types = [t for t in h["types"] if t in ["Product","Pharmacologic Substance"] or re.search("med",t,flags=re.IGNORECASE)!=None]
                        print i, h["cui"], h["exact"], rel_types if rel_types != [] else h["types"]
                    user_input = raw_input()

                    try:
                        n = int(user_input)
                        if n in range(len(hits)):
                            r["cui"]=[hits[n]["cui"]]
                            mapped = True
                    except:
                        if " " in user_input:
                            try:
                                n = [int(u) for u in user_input.split(" ")]
                                r["cui"] = list(set([hits[u]["cui"] for u in n]))
                                mapped = True
                            except:
                                pass

                    if not mapped and user_input == "f":
                        try:
                            r["cui"] = [custom_concepts[r["term"]]]
                        except KeyError:
                            r["cui"] = "CTC"+ str(cust_termid).zfill(6)
                            custom_concepts[r["term"]] = [r["cui"]]
                            cust_termid+=1
                        mapped = True

                if mapped:
                    w.writerow([";".join(r["cui"]),r["term"],r["pharma_concept"]])

    with open("data/farmaco_new_cuis.csv", "wb") as outf:
        w = csv.writer(outf, delimiter="|", encoding="utf-8")
        for t,c in custom_concepts.iteritems():
            w.writerow([c,t])


def temp_separate():
    from collections import defaultdict
    terms = defaultdict(lambda: {"rels":set(),"cuis":set()***REMOVED***)

    concepts = defaultdict(list)
    for r in read_rows("data/farmaco_terms.csv", header = ["term","pharma_concept"]):
        concepts[r["term"]].append(r["pharma_concept"])

    added_cuis = defaultdict(list)
    for r in read_rows("data/farmaco_terms_to_do_mapping_DONE.csv", header = ["cuis","term"]):
        print r
        if r["cuis"]!="":
            added_cuis[r["term"]].extend(r["cuis"].split(";"))

    for r in read_rows("data/farmaco_mapped_terms_backup.csv", header = ["cuis","term","pharma_concept"]):
        cuis = [x for x in r["cuis"].split(";") if x!='']
        # print cuis

        cui_mistake = all([len(x)==1 for x in cuis])
        if len(cuis)>1 and cui_mistake:
            cuis = ["".join(cuis)]

        if cuis == []:
            cuis = added_cuis[r["term"]]

        terms[r["term"]]["cuis"].update(cuis)
        terms[r["term"]]["rels"].update(concepts[r["term"]])

    all_terms = list(terms.keys())

    with open("data/farmaco_grouped_terms.csv", "wb") as outf:
        w = csv.writer(outf, delimiter="|", encoding="utf-8")
        for i,t in enumerate(all_terms):
            w.writerow([";".join(terms[t]["cuis"]), t,";".join(terms[t]["rels"])])

    with open("data/farmaco_terms_to_do_mapping.csv","wb") as outf:
        w = csv.writer(outf, delimiter="|", encoding="utf-8")
        for term, info in terms.iteritems():
            print info["cuis"], len(info["cuis"])
            if len(info["cuis"])==0:
                w.writerow([term, ";".join(terms[t]["rels"])])


def generate_neo4j_files():
    relations = set()

    with open("data/neo4j_farmaco_concepts.csv","wb") as outf:
        w = csv.writer(outf,encoding="utf-8",delimiter="|")
        w.writerow("")
        for r in read_rows("data/farmaco_concepts.csv", header = ["term","id","parents"]):
            w.writerow()


    for r in read_rows("data/farmaco_grouped_terms.csv"):



# generator that reads CSV files and gives them back in dictionary format
def read_rows(file_name, delimiter="|", header=None, replace_header=False):
    with open(file_name, "rU") as f:
        datareader = csv.reader(f, encoding="utf-8", delimiter=str(delimiter), errors='replace')
        if not header and not replace_header:
            header = next(datareader)
        if replace_header:
            x = next(datareader)
            if header == None:
                print "header not replaced because no header was specified"
                header=x
        for row in datareader:
            yield dict(zip(header, row))


if __name__ == '__main__':

    # extract()

    # map_terms()

    temp_separate()

