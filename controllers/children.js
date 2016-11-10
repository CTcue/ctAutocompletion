"use strict";

/** Usage

    curl -X POST -d '{
        "query": "C0006826"
***REMOVED***' "https://ctcue.com/umls/children"

*/

const config  = require('../config/config.js');
const _ = require("lodash");
const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase({
    "url": 'http://localhost:7474',
    "auth": config.neo4j
***REMOVED***);


const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  "host": [
    {
      "host": 'localhost',
      "auth": config.elastic_shield
***REMOVED***
  ]
***REMOVED***);


module.exports = function *() {
    var params = this.request.body.query;

    if (!config.neo4j["is_active"]) {
        return this.body = {***REMOVED***;
***REMOVED***

    var cypherObj = buildCypherObj(params);

    var children = yield function(callback) {
        db.cypher(cypherObj, function(err, paths) {
            if (err) {
              console.error(err);
              return callback(false, [])
        ***REMOVED***

            if (!paths || paths.length < 1 || !_.get(paths[0], "children")) {
                return callback(false, []);
        ***REMOVED***

            callback(null, paths[0]["children"].map(s => s["cui"]));
    ***REMOVED***);
***REMOVED***;

    var result = [];

    for (var i=0; i < children.length; i++) {
        var lookup = yield function(callback) {
            elasticClient.search({
                "index" : 'autocomplete',
                "size": 1, // Only need the preferred term for now
                "_source": ["pref"],
                "body" : {
                    "query" : {
                        "term" : {
                            "cui" : children[i]
                     ***REMOVED***
                 ***REMOVED***
            ***REMOVED***
        ***REMOVED***,
            function(err, resp) {
                if (resp && !!resp.hits && resp.hits.total > 0) {
                    var hits = resp.hits.hits;

                ***REMOVED*** Return ES source part only
                    if (hits.length > 0) {
                        var pref  = hits[0]._source.pref;
                        var types = hits[0]._source.types;

                        return callback(false, { "cui": children[i], "pref": pref ***REMOVED***);
                ***REMOVED***
            ***REMOVED***

                callback(false, false);
        ***REMOVED***);
    ***REMOVED***

        if (lookup) {
            result.push(lookup)
    ***REMOVED***
***REMOVED***

    this.body = result;
***REMOVED***;


function buildCypherObj(cui) {
    return {
        "query"  : buildQuery(cui),
        "params" : {
            "A": cui,
    ***REMOVED***,
        "lean": true
***REMOVED***;
***REMOVED***

function buildQuery(cui) {
    return `MATCH (t1:Concept { cui: {A***REMOVED*** ***REMOVED***), (t1)<-[:child_of]-(c)
                return COLLECT(distinct c) as children`
***REMOVED***