import relations.relation_utils as ru
from py2neo import neo4j, authenticate, Node, Graph, Relationship
from tqdm import *
import utils
import time
import itertools

from py2neo.packages.httpstream import http
# To avoid socket timeout when clearing the old graph
http.socket_timeout = 9999


def stamp():
    return time.strftime("%Y-%m-%d %H:%M")

def upload(umls_dir):


    try:
        # authenticate("localhost:7474", args.username, args.password)
        authenticate("localhost:7474", "neo4j", "bitterbal")

        db = Graph()

    except Exception as err:
        print 'Provide a valid Neo4j username and password'
        print err
        return

    print "[%s] clear old graph"%stamp()
    # Clear all neo4j entries
    db.delete_all()
    db.cypher.execute("CREATE INDEX ON :Concept(cui)")
    db.cypher.execute("CREATE INDEX ON :Farma_concept(id)")

    counter = 0
    tx = db.cypher.begin()

    print "[%s] Read CUIS" %stamp()

    used_CUIs = ru.get_CUIS()
    # used_CUIs = []

    print "[%s] start upload UMLS relations"%stamp()

    # row_counter = 0
    # for row in tqdm(utils.read_rows(umls_dir + "/MRREL.RRF", header=ru.rel_header, delimiter="|")):

    #     # # REMOVE THIS
    #     # if row_counter > 10:
    #     #     break
    #     # row_counter+=1

    #     if ru.canSkip(row, used_CUIs):
    #         continue

    #     counter += 1

    #     cypher =  """
    #         MERGE (a:Concept { cui: '%s' })
    #         MERGE (b:Concept { cui: '%s' })
    #         WITH a, b
    #             CREATE (b)-[:%s]->(a)
    #         RETURN a, b
    #     """ % (row["CUI1"], row["CUI2"], row["RELA"])
    #     tx.append(cypher)

    #     for cui in [row["CUI1"],row["CUI2"]]:
    #         if not used_CUIs[cui]["added"]:
    #             for t in used_CUIs[cui]["types"]:
    #                 cypher = """
    #                     MERGE (a:Concept { cui: '%s' })
    #                     MERGE (b:Type { type: '%s' })
    #                     WITH a, b
    #                         CREATE (a)-[:%s]->(b)
    #                     RETURN a,b
    #                     """%(cui, t, "has_type")
    #                 tx.append(cypher)

    #     if counter % 1000:
    #         tx.commit()
    #         tx = db.cypher.begin()


    # tx.commit()
    # tx = db.cypher.begin()

    print "\n[%s] upload UMLS done start upload pharma kompas relations"%stamp()

    count = 0
    for row in tqdm(utils.read_rows("relations/data/farmaco_concepts.csv", header=ru.rel_header_farmacoconcepts, delimiter="|")):

        row["name"]=row["name"].replace("'","")

        if row["parent"]=='':
            cypher = """
                    CREATE (a:Farma_concept { name: '%s', id: '%s' })
                    RETURN a
                    """%(row["name"], row["id"])
            tx.append(cypher)
        else:
            cypher = """
                    MATCH (b:Farma_concept { id:'%s' })
                    MERGE (a:Farma_concept { name: '%s', id: '%s' })
                    WITH a, b
                        CREATE (a)-[:%s]->(b)
                    RETURN a,b
                    """%(row["parent"], row["name"], row["id"], "pharma_isa")

            tx.append(cypher)


        count+=1

    tx.commit()
    tx = db.cypher.begin()

    print "\n[%s] upload pharma kompas relations done, upload term relations"%stamp()

    i = 0
    for row in tqdm(utils.read_rows("relations/data/farmaco_grouped_terms.csv", header=ru.rel_header_farmacoterms, delimiter="|")):
        if row["cuis"]=="":
            continue

        cuis = row["cuis"].split(";")
        parents = row["parents"].split(";")

        for parent, cui in itertools.product(parents, cuis):
            cypher = """
                        MATCH (b:Farma_concept { id:'%s' })
                        MERGE (a:Concept {cui: '%s'})
                        WITH a, b
                            CREATE (a)-[:%s]->(b)
                        RETURN a,b
                        """%(parent, cui, "pharma_isa")
            # print i, cui, parent, row["term"]
            tx.append(cypher)

            if i % 500==0:
                tx.commit()
                tx = db.cypher.begin()
                print "%s done"%i
            i+=1


    tx.commit()


    print "\n[%s] Added %s relations to neo4j" % (stamp(), count)

if __name__ == '__main__':
    upload("2015AA/META")