
const _ = require("lodash");

let config = {
    "host" : "localhost",
    "port" : 4080,

    "autocomplete": {
        "size": 24
    },

    "elasticsearch": {
        "version": "7.x",
        "host"   : "http://localhost:9200",
        "auth"   : {
            "username": "elastic",
            "password": "changeme"
        },
        "index": "autocomplete"
    },

    "api_token": "API_TOKEN"
};


try {
    const localConfig = require("./local_config.json");
    config = _.merge(config, localConfig);
}
catch (err) {}


module.exports = config;
