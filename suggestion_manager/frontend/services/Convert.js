
// Convert tables to parent + concepts

ctServices.factory('Convert', function () {

    return {
        tables: function(tables) {
            var concepts = [];

            for (var t in tables) {
                var table = tables[t];

                if (table.hasOwnProperty("_delete") && table._delete) {
                    continue;
            ***REMOVED***

            ***REMOVED*** Remove de-selected headers
                var header = table.header;
                var rows = table.rows;

                for (var i=0; i < rows.length; i++) {
                ***REMOVED*** Only include checked rows
                    if (!rows[i]["meta"].hasOwnProperty("checked") || !rows[i]["meta"]["checked"]) {
                        continue;
                ***REMOVED***

                    var concept = {***REMOVED***;
                    var has_data = false;

                    for (var k in rows[i]) {
                        if (header.hasOwnProperty(k)) {
                            var key = header[k] || "info";
                                key = key.toLowerCase().replace(/\s+/g, "-");

                            has_data = true;
                            concept[key] = rows[i][k];
                    ***REMOVED***
                ***REMOVED***

                    if (has_data) {
                        concepts.push(concept);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

            return concepts;
    ***REMOVED***
***REMOVED***
***REMOVED***);