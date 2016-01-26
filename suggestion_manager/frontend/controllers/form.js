'use strict';

app.controller('formController', function ($scope, $rootScope, $http, UMLS, neo4j, CRUD, Build, Convert) {

    $scope.isLoading = false;
    $scope.url = "";

    $scope.neo4j = neo4j;
    $scope.meta  = {***REMOVED***;
    $scope.validated_tables = false;

    $scope.extract = function(wiki_url) {
        if (typeof wiki_url === "undefined" || !/wikipedia/i.test(wiki_url)) {
            $rootScope.error = "I can only parse wikipedia pages (for now).";
            return;
    ***REMOVED***

        CRUD.post("extract", { "url": wiki_url ***REMOVED***)
            .then(function(result) {
                $scope.validated_tables = Build.tables(result.data.tables || []);

                $scope.meta["name"] = result.data.title || "";
                $scope.meta["description"] = result.data.description || "";

                $scope.meta["url"] = wiki_url;
        ***REMOVED***,
            function(err) {
                $rootScope.error = err;
        ***REMOVED***)
***REMOVED***


    $scope.custom = function() {
        $scope.validated_tables = Build.tables([[ [".."] ]]);

        $scope.meta["name"] = "";
        $scope.meta["description"] = "";
        $scope.meta["url"] = "";
***REMOVED***


    $scope.addRow = function(table) {
        var row_copy = angular.copy(table.rows[0]) || {***REMOVED***;

    ***REMOVED*** Create empty object with same keys as first row
        for (var k in row_copy) {
            row_copy[k] = "";
    ***REMOVED***

        row_copy["meta"] = {
            "checked": true
    ***REMOVED***;

        table.rows.push(row_copy)
***REMOVED***

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

                $http.post(UMLS.autocomplete, queryObj)
                    .then(function(result) {
                        var hits = result.data.hits || [];

                        if (hits.length > 0) {
                            row[new_key] = hits[0]["cui"];
                    ***REMOVED***
                        ***REMOVED***
                            row[new_key] = "";
                    ***REMOVED***
                ***REMOVED***)
        ***REMOVED***)(row, col_index, new_key)
    ***REMOVED***
***REMOVED***

***REMOVED***////////////
***REMOVED*** Save table data + info to neo4j

    $scope.submit = function(neo4j, meta, tables) {

        if (!meta || !meta.hasOwnProperty("name")) {
            $rootScope.error = "The group name is required.";
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
            $rootScope.error = "You at least one column header to create concepts.";
            return;
    ***REMOVED***

        CRUD.post("add", requestObj)
            .then(function(result) {
                $rootScope.error = false;
                $rootScope.msg = result.data.msg;

            ***REMOVED*** Reset stuff
                $scope.url   = "";
                $scope.meta  = {***REMOVED***;
                $scope.validated_tables = false;

                $scope.isLoading = false;
        ***REMOVED***,
            function(err) {
                $scope.isLoading = false;
                $rootScope.error = err;
        ***REMOVED***)
***REMOVED***
***REMOVED***);
