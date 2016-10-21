
var config  = require('../config/config.js');
var neo4j = require('neo4j');
var _ = require("lodash");

var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: config.neo4j
***REMOVED***);

var mongoDb = require('../lib/database');
var table   = mongoDb.table('umls');


module.exports = function * recommend() {
    var params = this.request.body.query;


***REMOVED*** Create Cypher query if neo4j is active
    if (_.get(config, "neo4j.is_active")) {
        var cypherObj = buildCypherObj(params.user, params.relation, params.synonym);

        if (cypherObj) {
            var addedRelation = yield function(callback) {
                db.cypher(cypherObj, function(err, res) {
                    if (err) {
                        callback(false, false);
                ***REMOVED***
                    ***REMOVED***
                        callback(false, true);
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***
***REMOVED***


***REMOVED*** Store it in mongoDb for concept_manager
    var addedTerm = false;

    if (_.has(params, "relation") && params.relation === "LIKES") {
        var data = {
            "user"     : params.user,
            "synonym"  : params.synonym,
            "isCustom" : (params.hasOwnProperty("isCustom") && params.isCustom),
            "created"  : new Date()
    ***REMOVED***;

        addedTerm = yield table.insert(data);
***REMOVED***


    this.body = !_.isEmpty(addedTerm);
***REMOVED***;


function buildCypherObj(user, relation, synonym) {
    if (typeof user === "undefined" || !user || !user.hasOwnProperty("_id")) {
        return false;
***REMOVED***
    if (typeof synonym === "undefined" || !synonym || !synonym.hasOwnProperty("term")) {
        return false;
***REMOVED***

    if (typeof relation === "undefined") {
        relation = "DISLIKES";
***REMOVED***

    var today = getDateToday();


***REMOVED*** MERGE to make sure we add unique users and concepts
***REMOVED*** CREATE UNIQUE to make sure we store user pref only once per day
***REMOVED*** - One user can contribute very little
    return {
        "query": `MERGE (u:User { id: {_USER_***REMOVED***, env: {_ENV_***REMOVED*** ***REMOVED***)
                  MERGE (s:Synonym { cui: {_CUI_***REMOVED***, label: {_LABEL_***REMOVED***, str: {_TERM_***REMOVED*** ***REMOVED***)
                  WITH u, s
                  CREATE UNIQUE
                     (u)-[:${relation***REMOVED*** { date: '${today***REMOVED***' ***REMOVED***]->(s)
                  RETURN u, s`,

        "params": {
            "_USER_"  : user._id,
            "_ENV_"   : user.env.trim().toLowerCase(),
            "_CUI_"   : synonym.cui,
            "_LABEL_" : synonym.label.trim().toLowerCase(),
            "_TERM_"  : synonym.term.trim().toLowerCase()
    ***REMOVED***,

        "lean" : true
***REMOVED***;
***REMOVED***


// Return YYYY.MM.DD date format
function getDateToday() {
    var date = new Date();
    return date.getFullYear() + "." + (date.getMonth()+1) + "." + date.getDay();
***REMOVED***
