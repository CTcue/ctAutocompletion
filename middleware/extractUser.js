"use strict";

module.exports = function *(next) {
    this.user = false;

    if (this.headers.hasOwnProperty("x-user")) {
    ***REMOVED*** Format `user_id=>environment`
        var user_header = this.headers["x-user"].split("=>");

    ***REMOVED***
            this.user = {
                "_id": user_header[0].trim(),
                "env": user_header[1].toLowerCase().trim()
        ***REMOVED***;
    ***REMOVED***
    ***REMOVED***
        ***REMOVED*** Wrong header format
            this.user = false;
    ***REMOVED***
***REMOVED***

    yield next;
***REMOVED***;
