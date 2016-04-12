from collections import defaultdict
import json
import requests
import unicodecsv as csv
import os
import datetime
import utils as u
import multiprocessing
import re
from source_processing.source_preprocessing import source_params

output_folder = source_params.output_folder

class Consumer(multiprocessing.Process):

    def __init__(self, input_que, result_que):
        multiprocessing.Process.__init__(self)
        self.input_que = input_que
        self.result_que = result_que

    def run(self):
        batch_nr=0
        while True:
            try:
                next_task = self.input_que.get()

                # Poison pill means shutdown
                if next_task is None:
                    break

                result = self.process_terms(next_task["batch"],next_task["source"])
                self.result_que.put(result)
                batch_nr+=1
                if batch_nr%50==0:
                    print "set of terms processed", next_task["source"], batch_nr

            except Exception,e:
                print(e)
                print("consumer died", self.pid)
                break
        print "consumer stopped naturally"

    def process_terms(self, terms, source):
        results = []

        for t in terms:
            result = check_term(t["term"], t["source_locs"], source)

            if result:
                results.append(result)

        return results


def set_up_multiprocessing():
    # Establish communication queues
    result_que = multiprocessing.Queue()
    input_que = multiprocessing.Queue()

    # Start consumers
    num_consumers = 4 # multiprocessing.cpu_count() * 2
    consumers = [ Consumer(input_que, result_que) for i in xrange(num_consumers) ]
    print( "Created %i consumers"% num_consumers)
    for w in consumers:
        w.start()

    return result_que, input_que, consumers

url = "http://localhost:4080/term_lookup"
def check_via_autocomplete(term):

    try:
        data = {"query":term}
        r = requests.post(url, data=json.dumps(data))
        result = r.json()
        return result["hits"]
    except Exception, e:
        print("lookup fail")
        print(e)
        print term
        return None

def check_sources(sourcegroup):


    result_que, input_que, consumers = set_up_multiprocessing()

    if sourcegroup == "SNOMED":
        sources = ["DHD","GGL_translate","snomed_NL"]
        # sources = ["DHD"]
        n = 0
        for s in sources:
            build_input_que(read_sourceterms(s), s, input_que)

    if sourcegroup == "MESH":
        build_input_que(read_PE(), "PE_MSHN", input_que)
        build_input_que(read_MSH(), "MSH_MSHN", input_que)

    if sourcegroup == "LOINC":
        build_input_que(read_sourceterms("LOINC"), "LOINC", input_que)

    # poison pills
    for c in consumers:
        input_que.put(None)

    result_terms=defaultdict(list)

    #precess results from result_que
    consumers_all_dead = not any([c.is_alive() for c in consumers])
    while not (result_que.empty() and consumers_all_dead):
        consumers_all_dead = not any([c.is_alive() for c in consumers])
        try:
            for result in result_que.get(timeout=3):
                # print result["term"], result["source_locs"]
                result_terms[result["term"]].extend(result["source_locs"])
        except Exception,e:
            print ".",
            continue
    print

    all_terms_to_file(result_terms, sourcegroup)

def read_sourceterms(s):
    fname = os.path.join(output_folder,"sourceterms_"+s+".csv")
    for i, row in enumerate(u.read_rows(fname, header=["term","elems"], delimiter="|")):
        term = {"term":row["term"],"source_locs":[]}
        for elem in row["elems"].split(":"):
            try:
                source_id, lan = elem.split("&")
            except:
                # print "ERROR in processing term", i, s
                continue
            term["source_locs"].append({"source_id":source_id,"lan":lan})
        yield term





MSH_file = source_params.params["MeSH"]["NL_file1"]
PE_file = source_params.params["MeSH"]["NL_file2"]
def read_PE():
    for r in u.read_rows(PE_file, delimiter=";"):
        yield {"source_locs":[{"source_id":r["UI"],"lan":"nl"}],"term":r["PRINT_ENTRY_NL"]}

def read_MSH():
    for r in u.read_rows(MSH_file, delimiter=";"):
        yield {"source_locs":[{"source_id":r["UI"],"lan":"nl"}],"term":r["MH_NL"]}

def build_input_que(terms, source, input_que):
    batch = []
    for term in terms:
        term["term"] = term["term"].lower()
        batch.append(term)
        if len(batch)==250:
            input_que.put({"batch":batch, "source":source})
            batch = []

    if batch != []:
        input_que.put({"batch":batch, "source":source})


repl_patterns = u.patterns_replacement()

def check_term(t, source_locs, source):
    if u.check_row({"STR":t},umls=False):
        t = u.normalize(t)
        for p in repl_patterns:
            t = re.sub(p[0],p[1],t)

        elems = check_via_autocomplete(t)
        if len(elems)!=0:

            result_terms = [e["exact"] for e in elems]

            if t in result_terms:
                return

            if any([edit_distance(t,rt)<3 for rt in result_terms]):
                return

        for elem in source_locs:
            elem["source"]=source
        return {"term":t, "source_locs":source_locs}

    return



def all_terms_to_file(terms, sourcegroup):
    with open(os.path.join(output_folder,"selected_sourceterms_"+sourcegroup+".csv"),"ab") as of:
        w = csv.writer(of,delimiter="|",encoding="utf-8")
        for t, source_lan in terms.iteritems():
            if t != "":
                elems = []
                for x in source_lan:
                    if isinstance(x["source_id"],int):
                        x["source_id"]=str(x["source_id"])
                    elems.append(x["source_id"]+"&"+x["lan"]+"&"+x["source"])
                w.writerow([t,":".join(elems)])


def edit_distance(str1, str2):
    """Make a Levenshtein Distances Matrix"""
    n1, n2 = len(str1), len(str2)
    lev_matrix = [ [ 0 for i1 in range(n1 + 1) ] for i2 in range(n2 + 1) ]

    for i1 in range(1, n1 + 1):
        lev_matrix[0][i1] = i1

    for i2 in range(1, n2 + 1):
        lev_matrix[i2][0] = i2

    for i2 in range(1, n2 + 1):
        for i1 in range(1, n1 + 1):
            cost = 0 if str1[i1-1] == str2[i2-1] else 1
            elem = min( lev_matrix[i2-1][i1] + 1,
                        lev_matrix[i2][i1-1] + 1,
                        lev_matrix[i2-1][i1-1] + cost )
            lev_matrix[i2][i1] = elem

    return lev_matrix[-1][-1]

if __name__ == '__main__':
    check_sources("MESH")
    check_sources("SNOMED")
    check_sources("LOINC")
