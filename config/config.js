var config = {}

config.host = process.env.NODE_ENV === 'production'
              ? '188.226.214.70'
              : 'localhost';

config.port = process.env.NODE_ENV === 'production'
              ? 80
              : 4050;

config.path = 'http://'
              + config.host
              + ':'
              + config.port;


config.elastic = {
  db : {
    "host"  : "http://localhost:9200"
  }
};

module.exports = config;