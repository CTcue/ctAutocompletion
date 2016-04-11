# THIS IS NOT DONE AND DOES NOT WORK

from py2neo import Graph
from utils import read_rows

graph = Graph("http://localhost:4082/db/data/")

for row in read_rows("relations/data/used_CUIs.csv", header = ["cui","term","types"], replace_header=True)
    concept = Node("Concept", cui=row["cui"], term=row["term"])
    graph.create(concept)

for row in read_rows("relations/data/concepts_types.csv", header = ["type"], replace_header=True)
    concept_type = Node("Type", type=row["type"])
    graph.create(concept_type)

# how to refer to the different concepts in this script!!
for row in read_rows("relations/data/relations_types.csv", header = ["from","to","type"], replace_header=True)
    Relationship(row["from"], , bob, since=1999)
    graph.create(alice)

