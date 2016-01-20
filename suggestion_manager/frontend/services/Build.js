ctServices.factory('Build', function () {

    function capitalize(str) {
        if (!str || typeof str !== "string" || !str.length) {
            return "";
        }

        return str[0].toUpperCase() + str.slice(1);
    }

    return {
        // Copy data from extracted table that allows checking & editing
        tables: function(tables) {
            var res = {};

            // Parse all tables
            for (var i=0; i < tables.length; i++) {
                var table_index = i.toString();
                res[table_index] = {
                    "rows": [],
                    "header": {}
                };

                var rows = [];

                // Parse rows
                for (var j=0; j<tables[i].length; j++) {
                    var is_empty = tables[i][j].filter(function(s) { return s.trim(); })
                    if (is_empty.length === 0) {
                        continue;
                    }

                    var row_index = j.toString();

                    var row = {
                        "meta": {
                            "checked": true
                        }
                    };

                    // Parse columns
                    for (var c=0; c < tables[i][j].length; c++) {
                        // Set row data to parsed wikipedia data
                        row[c.toString()] = capitalize(tables[i][j][c]);
                    }

                    rows.push(row);
                }

                res[table_index]['rows'] = rows;
            }

            return res;
        }
    }
});