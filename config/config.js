var config = {}

config.host = process.env.NODE_ENV === 'production'
              ? '178.62.230.23'
              : 'localhost';

config.port = process.env.NODE_ENV === 'production'
              ? 80
              : 4050;

config.path = 'http://'
              + config.host
              + ':'
              + config.port;

config.elastic = "http://localhost:9200"

config.mysql = {
  host      : 'localhost',
  user      : 'cumls',
  password  : 'b7B5mDNu',
  database  : 'umls'
};

module.exports = config;