'use strict';

app.controller('formController', function ($scope, $rootScope, $http, UMLS, neo4j, CRUD, Build, Convert) {

    $scope.isLoading = false;
    $scope.url = "";

    $scope.neo4j = neo4j;
    $scope.meta  = {};
    $scope.validated_tables = false;

    $scope.extract = function(wiki_url) {
        if (typeof wiki_url === "undefined" || !/wikipedia/i.test(wiki_url)) {
            $rootScope.error = "I can only parse wikipedia pages (for now).";
            return;
        }

        CRUD.post("extract", { "url": wiki_url })
            .then(function(result) {
                $scope.validated_tables = Build.tables(result.data.tables || []);

                $scope.meta["name"] = result.data.title || "";
                $scope.meta["description"] = result.data.description || "";

                $scope.meta["url"] = wiki_url;
            },
            function(err) {
                $rootScope.error = err;
            })
    }


    $scope.custom = function() {
        $scope.validated_tables = Build.tables([[ [".."] ]]);

        $scope.meta["name"] = "";
        $scope.meta["description"] = "";
        $scope.meta["url"] = "";
    }


    $scope.addRow = function(table) {
        var row_copy = angular.copy(table.rows[0]) || {};

        // Create empty object with same keys as first row
        for (var k in row_copy) {
            row_copy[k] = "";
        }

        row_copy["meta"] = {
            "checked": true
        };

        table.rows.push(row_copy)
    }

    function newKeyName(table) {
        // Get name for new column
        var first_row = table.rows[0] || {};
        var key_count = Object.keys(first_row).length;

        return "" + key_count;
    }

    $scope.addColumn = function(table) {
        var new_key = newKeyName(table);

        // Add empty column to each row
        for (var i=0; i < table.rows.length; i++) {
            table.rows[i][new_key] = "";
        }
    }

    $scope.removeColumn = function(wanted, col_index) {
        // Remove header label
        delete wanted['header'][col_index];

        // Remove column in each row
        for (var i=0; i < wanted.rows.length; i++) {
            delete wanted.rows[i][col_index];
        }
    }

    // TODO: Allow "Undo"?
    $scope.removeTable = function(index) {
        $scope.validated_tables[index]._delete = true;
    }


    $scope.isEmpty = function(obj) {
        return Object.keys(obj).length === 0;
    }

    $scope.getCUI = function(table, col_index) {
        // Check if at least a row row is selected
        if (typeof col_index === "undefined" || !col_index) {
            return;
        }

        var new_key = newKeyName(table);

        // Autofill header
        table.header[new_key] = "CUI";

        for (var i=0; i < table.rows.length; i++) {
            var row = table.rows[i];

            // Check if row checkbox is selected
            if (!row["meta"].hasOwnProperty("checked") || !row["meta"]["checked"]) {
                continue;
            }

            // Check if the term in this row exists / not empty
            if (!row.hasOwnProperty(col_index) || !row[col_index].length) {
                continue;
            }

            // Query UMLS autocomplete for CUI code
            (function findCui(row, col_index, new_key) {
                var queryObj = {
                    "query": row[col_index]
                };

                $http.post(UMLS.autocomplete, queryObj)
                    .then(function(result) {
                        var hits = result.data.hits || [];

                        if (hits.length > 0) {
                            row[new_key] = hits[0]["cui"];
                        }
                        else {
                            row[new_key] = "";
                        }
                    })
            })(row, col_index, new_key)
        }
    }

    //////////////
    // Save table data + info to neo4j

    $scope.submit = function(neo4j, meta, tables) {

        if (!meta || !meta.hasOwnProperty("name")) {
            $rootScope.error = "The group name is required.";
            return;
        }

        $scope.isLoading = true;

        var requestObj = {
            "neo4j": neo4j,
            "parent" : meta,
            "concepts": Convert.tables(tables)
        };

        if (! requestObj.concepts.length) {
            $scope.isLoading = false;
            $rootScope.error = "You at least one column header to create concepts.";
            return;
        }

        CRUD.post("add", requestObj)
            .then(function(result) {
                $rootScope.error = false;
                $rootScope.msg = result.data.msg;

                // Reset stuff
                $scope.url   = "";
                $scope.meta  = {};
                $scope.validated_tables = false;

                $scope.isLoading = false;
            },
            function(err) {
                $scope.isLoading = false;
                $rootScope.error = err;
            })
    }
});
