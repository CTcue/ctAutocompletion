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

module.exports = config;