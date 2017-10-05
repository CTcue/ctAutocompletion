"use strict";

var config = {
    "host" : "localhost",
    "port" : 4080,

    "mongodb": {
        "path" : "mongodb://localhost/umls"
    },

    "elasticsearch": {
        "version": "5.6",
        "host"   : "localhost",
        "auth"   : "elastic:changeme"
    }
};


if (process.env.NODE_ENV === "production") {
    config.api_token = "Test123";

    // try {
    //     config.neo4j = require(secretConfig + "neo4j");
    // }
    // catch (err) {
    //     config.neo4j = {
    //         "username": "neo4j",
    //         "password": "password",
    //         "verification_token": "sample123",
    //         "verification_admin": "sample456"
    //     };
    // }
}
else {
    // If need_tokens is true, you need to provide verification tokens similar to
    // production version of `config.neo4j = require(secretConfig + "neo4j")`
    config.neo4j = {
        "username": "neo4j",
        "password": "test123",
    };

    config.api_token = "Not-a-real-token";
}


// Assume neo4j is active
config.neo4j["is_active"] = true;
config.path    = "http://"+ config.host + ":" + config.port;
config.elastic = "http://localhost:9200";


module.exports = config;
