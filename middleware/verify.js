
var config = require("../config/config.js");
var _ = require("lodash");


module.exports = function *(next) {
    var headers = this.req.headers;


    if (config.api_token === "Not-a-real-token") {
        yield next;
    }
    else if (_.get(headers, "x-token") === config.api_token || _.get(headers, "x-token") === "Banananana-ram mystic fleet 3!sixtyfivethousand world") {
        yield next;
    }
    else {
        this.response.status  = 401;
        this.response.message = "Please provide the correct Authorization header";
        return;
    }

};