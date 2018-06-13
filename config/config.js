
var config = {
    "host" : "localhost",
    "port" : 4080,

    "mongodb": {
        "path" : "mongodb://localhost/umls"
    },

    "elasticsearch": {
        "version": "6.2",
        "host"   : "localhost",
        "auth"   : "elastic:changeme"
    }
}

if (process.env.NODE_ENV === 'production') {
    // Production tokens/settings
    // * placed outside the ctAutocompletion directory

    var secretConfig = "../../ctcue-config/";

    config.api_token = require(secretConfig + "ctAutocompletion_secret").token;
};


config.path    = "http://"+ config.host + ":" + config.port;
config.elastic = "http://localhost:9200";


module.exports = config;
