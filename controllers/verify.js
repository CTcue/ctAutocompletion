
var config = require("../config/config.js");


module.exports = function *(next) {
    var headers = this.req.headers;
    var conf    = config.neo4j;


    if (conf.hasOwnProperty("need_tokens") && !conf.need_tokens) {
        yield next;
    }
    else if (conf.hasOwnProperty("verification_token") && headers["umls-u-token"] === conf.verification_token) {
        yield next;
    }
    else {
        this.response.status  = 401;
        this.response.message = "Please provide the correct Authorization header";
    }
};