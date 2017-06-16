"use strict";

module.exports = function *(next) {
    this.user = false;

    if (this.headers.hasOwnProperty("x-user")) {
        // Format `user_id=>environment`
        var user_header = this.headers["x-user"].split("=>");

        try {
            this.user = {
                "_id": user_header[0].trim(),
                "env": user_header[1].toLowerCase().trim()
            };
        }
        catch (err) {
            // Wrong header format
            this.user = false;
        }
    }

    yield next;
};
