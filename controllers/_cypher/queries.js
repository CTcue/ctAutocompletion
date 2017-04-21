

exports.__parents = function() {
    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***), (t1)-[:child_of]->(p) return COLLECT(distinct p) as list`
***REMOVED***

exports.__shared_parents = function() {
    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***), (t2:Concept { cui: {B***REMOVED*** ***REMOVED***), (t1)-[:child_of]->(p)<-[:child_of]-(t2) return COLLECT(distinct p) as list`
***REMOVED***

exports.__children = function() {
    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***), (t1)<-[:child_of]-(c) return COLLECT(distinct c) as list`
***REMOVED***

exports.__siblings = function() {
    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***), (t1)-[:sibling_of]-(s) return COLLECT(distinct s) as list`
***REMOVED***

exports.__brands = function() {
    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***),
        (t1)<-[:brand]-(b)
            return COLLECT(distinct b)[0..20] as list`
***REMOVED***

exports.__related_brands = function() {
    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***),
        (t1)-[:brand]->(b)<-[:brand]-(N)
            return b + COLLECT(distinct N)[0..20] as list`
***REMOVED***

// Currently not used
exports.__shortestPath = function() {
    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***), (t2:Concept { cui: {B***REMOVED*** ***REMOVED***),
            p = shortestPath((t1)<-[*..3]->(t2))
            return p`
***REMOVED***
