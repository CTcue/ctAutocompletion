
const _ = require("lodash");


let config = {
    "host" : "localhost",
    "port" : 4080,

    "elasticsearch": {
        "version": "5.4",
        "host"   : "localhost",
        "port"   : 9200,
        "auth"   : ""
    },

    "mongodb": {
        "path" : "mongodb://localhost/umls"
    },

    "api_token": "API_TOKEN"
};


try {
    const localConfig = require("./local_config.json");
    config = _.merge(config, localConfig);
}
catch (err) {}


module.exports = config;
