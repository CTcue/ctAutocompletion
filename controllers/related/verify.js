
var config = require("../../config/config.js");


module.exports = function *(next) {
    var headers = this.req.headers;

    console.log(headers);

***REMOVED*** if (secureCode === headers["x-auth-token"]) {
***REMOVED***     yield next;
***REMOVED*** ***REMOVED***
***REMOVED*** ***REMOVED***
***REMOVED***     this.response.status  = 401;
***REMOVED***     this.response.message = "Please provide the correct Authorization header";
***REMOVED*** ***REMOVED***

    yield next;
***REMOVED***;