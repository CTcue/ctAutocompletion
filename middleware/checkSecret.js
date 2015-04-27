
var secureCode = require("../ctcue-config/ctSearch_secret").cumls;

module.exports = function *(next) {
    var headers = this.req.headers;

    if (typeof secureCode !== "undefined" && secureCode === headers["x-auth-token"]) {
        yield next();
***REMOVED***
    ***REMOVED***
        this.response.status  = 401;
        this.response.message = "Please provide the correct Authorization header";
***REMOVED***
***REMOVED***;