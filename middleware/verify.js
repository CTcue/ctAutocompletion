
var config = require("../config/config.js");
var _ = require("lodash");


module.exports = function *(next) {
    var headers = this.req.headers;

    if (_.get(headers, "x-token") === config.api_token) {
        yield next;
***REMOVED***
    ***REMOVED***
        this.response.status  = 401;
        this.response.message = "Please provide the correct Authorization header";
***REMOVED***
***REMOVED***;