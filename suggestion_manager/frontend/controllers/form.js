'use strict';

app.controller('relatedController', function ($scope, UMLS, api, neo4j, CRUD, Build, Convert) {

    $scope.isLoading = false;
    $scope.url = "";

    $scope.neo4j = neo4j;
    $scope.meta  = {};
    $scope.validated_tables = false;

    $scope.extract = function(wiki_url) {
        if (typeof wiki_url === "undefined" || !/wikipedia/i.test(wiki_url)) {
            $scope.error = "I can only parse wikipedia pages (for now).";
            return;
        }

        CRUD.post(api.path, "extract", { "url": wiki_url })
            .then(function(result) {
                $scope.validated_tables = Build.tables(result.data.tables || []);

                $scope.meta["name"] = result.data.title || "";
                $scope.meta["description"] = result.data.description || "";

                $scope.meta["url"] = wiki_url;
            },
            function(err) {
                $scope.error = err;
            })
    }


    $scope.custom = function() {
        $scope.validated_tables = Build.tables([[ [".."] ]]);

        $scope.meta["name"] = "";
        $scope.meta["description"] = "";
        $scope.meta["url"] = "";
    }


    var addRowFn = function(table, val) {
        if (typeof val === "undefined") {
            val = "";
        }

        var row_copy = angular.copy(table.rows[0]) || {};

        // Create empty object with same keys as first row
        for (var k in row_copy) {
            row_copy[k] = val;
        }

        row_copy["meta"] = {
            "checked": true
        };

        table.rows.push(row_copy)
    }
    $scope.addRow = addRowFn;


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

                CRUD.post(UMLS.url, "autocomplete", queryObj)
                    .then(function(result) {
                        var hits = result.data.hits || [];

                        if (hits.length > 0) {
                            row[new_key] = hits[0]["cui"];
                        }
                        else {
                            row[new_key] = "";
                        }
                    })
            })(row, col_index, new_key);
        }
    }


    // Copy paste text and split it into usable rows
    $scope.parseForRows = function(text, table) {
        // If custom table -> uncheck first "empty" row
        if (table.rows.length === 1 && table.rows[0].hasOwnProperty("0") && table.rows[0][0] === "..") {
            table.rows[0]["meta"]["checked"] = false;
        }

        var split = text
            .trim()
            .split("\n")
            .map(function(s) { return s.replace(/^[^A-Za-z]+/, ""); })
            .filter(function(s) { return s && s.length > 2; })
            .map(function(s) { return s.split(/[,\t]| and | en | of | or /); })
            .reduce(function(res, s) { return res.concat(s) }, []) // Flatten

        for (var i=0; i<split.length; i++) {
            addRowFn(table, split[i].trim());
        }
    }

    //////////////
    // Save table data + info to neo4j

    $scope.submit = function(neo4j, meta, tables) {
        if (!meta || !meta.hasOwnProperty("name")) {
            $scope.error = "The group name is required.";
            return;
        }

        if (! $scope.neo4j.hasOwnProperty("password") || ! $scope.neo4j.password) {
            $scope.error = "Please provide the Neo4j password";
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
            $scope.error = "You need at least one column with data.";
            return;
        }

        CRUD.post(api.path, "add", requestObj)
            .then(function(result) {
                $scope.error = false;
                $scope.msg = result.data.msg;

                // Reset stuff
                $scope.url   = "";
                $scope.meta  = {};
                $scope.validated_tables = false;

                $scope.isLoading = false;
            },
            function(err) {
                $scope.isLoading = false;
                $scope.error = err;
            })
    }
});
