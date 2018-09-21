
const _ = require("lodash");


let config = {
    "host" : "localhost",
    "port" : 4080,

    "elasticsearch": {
        "version": "6.2",
        "host"   : "localhost",
        "port"   : 9200,
        "auth"   : "elastic:changeme"
    }
};


try {
    const localConfig = require("./local_config.json");
    config = _.merge(config, localConfig);
}
catch (err) {}


module.exports = config;
