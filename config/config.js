
var secretConfig = '../../ctcue-config/';
var config = {}


if (process.env.NODE_ENV === 'production') {
  config.host = '178.62.230.23';
  config.port = 4080;

  config.neo4j = require(secretConfig + 'neo4j');
}
else {
  config.host = 'localhost';
  config.port = 4080;

  config.neo4j = { "username": "neo4j", "password": "test123" };
}

config.path    = 'http://'+ config.host + ':' + config.port;

config.elastic = "http://localhost:9200";

config.mongodb = {
    "path" : "mongodb://localhost/umls"
};


config.demographic_types = require(secretConfig + 'demographic_types');


module.exports = config;