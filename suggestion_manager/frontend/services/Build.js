ctServices.factory('Build', function () {

    function capitalize(str) {
        if (!str || typeof str !== "string" || !str.length) {
            return "";
    ***REMOVED***

        return str[0].toUpperCase() + str.slice(1);
***REMOVED***

    return {
    ***REMOVED*** Copy data from extracted table that allows checking & editing
        tables: function(tables) {
            var res = {***REMOVED***;

        ***REMOVED*** Parse all tables
            for (var i=0; i < tables.length; i++) {
                var table_index = i.toString();
                res[table_index] = {
                    "rows": [],
                    "header": {***REMOVED***
            ***REMOVED***;

                var rows = [];

            ***REMOVED*** Parse rows
                for (var j=0; j<tables[i].length; j++) {
                    var is_empty = tables[i][j].filter(function(s) { return s.trim(); ***REMOVED***)
                    if (is_empty.length === 0) {
                        continue;
                ***REMOVED***

                    var row_index = j.toString();

                    var row = {
                        "meta": {
                            "checked": true
                    ***REMOVED***
                ***REMOVED***;

                ***REMOVED*** Parse columns
                    for (var c=0; c < tables[i][j].length; c++) {
                    ***REMOVED*** Set row data to parsed wikipedia data
                        row[c.toString()] = capitalize(tables[i][j][c]);
                ***REMOVED***

                    rows.push(row);
            ***REMOVED***

                res[table_index]['rows'] = rows;
        ***REMOVED***

            return res;
    ***REMOVED***
***REMOVED***
***REMOVED***);