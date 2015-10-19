
module.exports = function *(next) {
    var maxLength = 2048;

    if (this.req.method === 'POST') {
        this.request.body = {};

        if (this.req.headers['content-length'] > maxLength) {
            this.status = 413;
            this.body   = "Request too large";
            return;
        }

        var req_body = yield function(callback) {
            var chunks = "";

            this.req.on('data', function(chunk) {
                chunks += chunk.toString();

                if (chunks.length > maxLength) {
                    callback(false, false);
                }
            });

            this.req.on('end', function() {
                if (!chunks || chunks.length === 0) {
                    callback(null, {});
                }

                try {
                    var parsed = JSON.parse(chunks);
                    callback(null, parsed);
                }
                catch (err) {
                    callback(false, false);
                }
            });
        }

        if (!req_body) {
            this.status = 413;
            this.body   = "Request is too large or contains invalid JSON";
            return;
        }

        if (!req_body.hasOwnProperty("query") || typeof req_body.query !== "string") {
            this.status = 400;
            this.body = 'Please provide a valid request object: { "query": "Your search term" }';
            return;
        }

        this.request.body = req_body;
    }

    yield next;
}