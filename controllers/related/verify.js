
var config = require("../../config/config.js");


module.exports = function *(next) {
    var headers = this.req.headers;

    console.log(headers);

    // if (secureCode === headers["x-auth-token"]) {
    //     yield next;
    // }
    // else {
    //     this.response.status  = 401;
    //     this.response.message = "Please provide the correct Authorization header";
    // }

    yield next;
};