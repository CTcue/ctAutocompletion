

var config = {}


if (process.env.NODE_ENV === 'production') {
    //
    // Production tokens/settings
    // - place these in a folder outside the ctAutocompletion directory

    var secretConfig = '../../ctcue-config/';

    config.host = 'localhost';
    config.port = 4080;

    config.api_token = require(secretConfig + "ctAutocompletion_secret").token;




    try {
        config.elastic_shield = require(secretConfig + 'local_elasticsearch_shield')._shield;
    }
    catch (err) {
        config.elastic_shield = "";
    }
}
else {
    //
    // Development tokens/settings
    //

    config.host = 'localhost';
    config.port = 4080;

    config.api_token = "Not-a-real-token";
    config.elastic_shield = "";
}


config.path = 'http://'+ config.host + ':' + config.port;
config.elastic = "http://localhost:9200";

config.mongodb = {
    "path" : "mongodb://localhost/umls"
};


module.exports = config;
