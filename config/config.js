var config = {}

if (process.env.NODE_ENV === 'production') {
  var cUMLS = require("../ctcue-config/cUMLS");

  config.host = '178.62.230.23';
  config.port = 80;

  config.mysql = cUMLS.mysql;
}
else {
  config.host = 'localhost';
  config.port = 4050;

  config.mysql = {
    host      : 'localhost',
    user      : 'root',
    password  : '',
    database  : 'umls'
  };
}

config.mongodb = {
  "path"        : "mongodb://localhost/ctUMLS",
  "user"        : "",
  "pass"        : ""
};

config.elastic = "http://localhost:9200";

config.path = 'http://'
              + config.host
              + ':'
              + config.port;


module.exports = config;