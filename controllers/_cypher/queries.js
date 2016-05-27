

exports.__parents = function() {
    return `MATCH (t1:Concept { cui: {A} }), (t1)-[:child_of]->(p) return COLLECT(p) as list`
}

exports.__shared_parents = function() {
    return `MATCH (t1:Concept { cui: {A} }), (t2:Concept { cui: {B} }), (t1)-[:child_of]->(p)<-[:child_of]-(t2) return COLLECT(p) as list`
}

exports.__children = function() {
    return `MATCH (t1:Concept { cui: {A} }), (t1)<-[:child_of]-(c) return COLLECT(c) as list`
}

exports.__siblings = function() {
    return `MATCH (t1:Concept { cui: {A} }), (t1)-[:sibling_of]-(s) return COLLECT(s) as list`
}


// Currently not used
exports.__shortestPath = function() {
    return `MATCH (t1:Concept { cui: {A} }), (t2:Concept { cui: {B} }),
            p = shortestPath((t1)<-[*..3]->(t2))
            return p`
}
