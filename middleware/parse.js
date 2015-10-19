
module.exports = function *(next) {
    var maxLength = 512;

    if (this.req.method === 'POST') {
        this.request.body = {***REMOVED***;

        if (this.req.headers['content-length'] > maxLength) {
            this.status = 413;
            this.body   = "Request too large";
            return;
    ***REMOVED***

        var req_body = yield function(callback) {
            var chunks = "";

            this.req.on('data', function(chunk) {
                chunks += chunk.toString();

                if (chunks.length > maxLength) {
                    callback(false, false);
            ***REMOVED***
        ***REMOVED***);

            this.req.on('end', function() {
                if (!chunks || chunks.length === 0) {
                    callback(null, {***REMOVED***);
            ***REMOVED***

            ***REMOVED***
                    var parsed = JSON.parse(chunks);
                    callback(null, parsed);
            ***REMOVED***
            ***REMOVED***
                    callback(false, false);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

        if (!req_body) {
            this.status = 413;
            this.body   = "Request is too large or contains invalid JSON";
            return;
    ***REMOVED***

        if (!req_body.hasOwnProperty("query") || typeof req_body.query !== "string") {
            this.status = 400;
            this.body = 'Please provide a valid request object: { "query": "Your search term" ***REMOVED***';
            return;
    ***REMOVED***

        this.request.body = req_body;
***REMOVED***

    yield next;
***REMOVED***