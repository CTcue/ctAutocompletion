'use strict';

app.controller('relatedController', function ($scope, UMLS, api, neo4j, CRUD, Build, Convert) {

    $scope.isLoading = false;
    $scope.url = "";

    $scope.neo4j = neo4j;
    $scope.meta  = {***REMOVED***;
    $scope.validated_tables = false;

    $scope.extract = function(wiki_url) {
        if (typeof wiki_url === "undefined" || !/wikipedia/i.test(wiki_url)) {
            $scope.error = "I can only parse wikipedia pages (for now).";
            return;
    ***REMOVED***

        CRUD.post(api.path, "extract", { "url": wiki_url ***REMOVED***)
            .then(function(result) {
                $scope.validated_tables = Build.tables(result.data.tables || []);

                $scope.meta["name"] = result.data.title || "";
                $scope.meta["description"] = result.data.description || "";

                $scope.meta["url"] = wiki_url;
        ***REMOVED***,
            function(err) {
                $scope.error = err;
        ***REMOVED***)
***REMOVED***


    $scope.custom = function() {
        $scope.validated_tables = Build.tables([[ [".."] ]]);

        $scope.meta["name"] = "";
        $scope.meta["description"] = "";
        $scope.meta["url"] = "";
***REMOVED***


    var addRowFn = function(table, val) {
        if (typeof val === "undefined") {
            val = "";
    ***REMOVED***

        var row_copy = angular.copy(table.rows[0]) || {***REMOVED***;

    ***REMOVED*** Create empty object with same keys as first row
        for (var k in row_copy) {
            row_copy[k] = val;
    ***REMOVED***

        row_copy["meta"] = {
            "checked": true
    ***REMOVED***;

        table.rows.push(row_copy)
***REMOVED***
    $scope.addRow = addRowFn;


    function newKeyName(table) {
    ***REMOVED*** Get name for new column
        var first_row = table.rows[0] || {***REMOVED***;
        var key_count = Object.keys(first_row).length;

        return "" + key_count;
***REMOVED***

    $scope.addColumn = function(table) {
        var new_key = newKeyName(table);

    ***REMOVED*** Add empty column to each row
        for (var i=0; i < table.rows.length; i++) {
            table.rows[i][new_key] = "";
    ***REMOVED***
***REMOVED***

    $scope.removeColumn = function(wanted, col_index) {
    ***REMOVED*** Remove header label
        delete wanted['header'][col_index];

    ***REMOVED*** Remove column in each row
        for (var i=0; i < wanted.rows.length; i++) {
            delete wanted.rows[i][col_index];
    ***REMOVED***
***REMOVED***

***REMOVED*** TODO: Allow "Undo"?
    $scope.removeTable = function(index) {
        $scope.validated_tables[index]._delete = true;
***REMOVED***


    $scope.isEmpty = function(obj) {
        return Object.keys(obj).length === 0;
***REMOVED***

    $scope.getCUI = function(table, col_index) {
    ***REMOVED*** Check if at least a row row is selected
        if (typeof col_index === "undefined" || !col_index) {
            return;
    ***REMOVED***

        var new_key = newKeyName(table);

    ***REMOVED*** Autofill header
        table.header[new_key] = "CUI";

        for (var i=0; i < table.rows.length; i++) {
            var row = table.rows[i];

        ***REMOVED*** Check if row checkbox is selected
            if (!row["meta"].hasOwnProperty("checked") || !row["meta"]["checked"]) {
                continue;
        ***REMOVED***

        ***REMOVED*** Check if the term in this row exists / not empty
            if (!row.hasOwnProperty(col_index) || !row[col_index].length) {
                continue;
        ***REMOVED***

        ***REMOVED*** Query UMLS autocomplete for CUI code
            (function findCui(row, col_index, new_key) {
                var queryObj = {
                    "query": row[col_index]
            ***REMOVED***;

                CRUD.post(UMLS.url, "autocomplete", queryObj)
                    .then(function(result) {
                        var hits = result.data.hits || [];

                        if (hits.length > 0) {
                            row[new_key] = hits[0]["cui"];
                    ***REMOVED***
                        ***REMOVED***
                            row[new_key] = "";
                    ***REMOVED***
                ***REMOVED***)
        ***REMOVED***)(row, col_index, new_key);
    ***REMOVED***
***REMOVED***


***REMOVED*** Copy paste text and split it into usable rows
    $scope.parseForRows = function(text, table) {
    ***REMOVED*** If custom table -> uncheck first "empty" row
        if (table.rows.length === 1 && table.rows[0].hasOwnProperty("0") && table.rows[0][0] === "..") {
            table.rows[0]["meta"]["checked"] = false;
    ***REMOVED***

        var split = text
            .trim()
            .split("\n")
            .map(function(s) { return s.replace(/^[^A-Za-z]+/, ""); ***REMOVED***)
            .filter(function(s) { return s && s.length > 2; ***REMOVED***)
            .map(function(s) { return s.split(/[,\t]| and | en | of | or /); ***REMOVED***)
            .reduce(function(res, s) { return res.concat(s) ***REMOVED***, []) // Flatten

        for (var i=0; i<split.length; i++) {
            addRowFn(table, split[i].trim());
    ***REMOVED***
***REMOVED***

***REMOVED***////////////
***REMOVED*** Save table data + info to neo4j

    $scope.submit = function(neo4j, meta, tables) {
        if (!meta || !meta.hasOwnProperty("name")) {
            $scope.error = "The group name is required.";
            return;
    ***REMOVED***

        if (! $scope.neo4j.hasOwnProperty("password") || ! $scope.neo4j.password) {
            $scope.error = "Please provide the Neo4j password";
            return;
    ***REMOVED***


        $scope.isLoading = true;

        var requestObj = {
            "neo4j": neo4j,
            "parent" : meta,
            "concepts": Convert.tables(tables)
    ***REMOVED***;

        if (! requestObj.concepts.length) {
            $scope.isLoading = false;
            $scope.error = "You need at least one column with data.";
            return;
    ***REMOVED***

        CRUD.post(api.path, "add", requestObj)
            .then(function(result) {
                $scope.error = false;
                $scope.msg = result.data.msg;

            ***REMOVED*** Reset stuff
                $scope.url   = "";
                $scope.meta  = {***REMOVED***;
                $scope.validated_tables = false;

                $scope.isLoading = false;
        ***REMOVED***,
            function(err) {
                $scope.isLoading = false;
                $scope.error = err;
        ***REMOVED***)
***REMOVED***
***REMOVED***);
