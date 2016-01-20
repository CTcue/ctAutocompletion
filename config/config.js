
var secretConfig = '../../ctcue-config/';
var config = {}


if (process.env.NODE_ENV === 'production') {
  config.host = '178.62.230.23';
  config.port = 4080;
}
else {
  config.host = 'localhost';
  config.port = 4080;
}

config.path    = 'http://'+ config.host + ':' + config.port;
config.elastic = "http://localhost:9200";

config.neo4j = require(secretConfig + 'neo4j');

module.exports = config;