var config = {}

if (process.env.NODE_ENV === 'production') {
  config.host = '178.62.230.23';
  config.port = 80;

  config.mysql = {
    host      : 'localhost',
    user      : 'cumls',
    password  : 'b7B5mDNu',
    database  : 'umls'
  };

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

config.elastic = "http://localhost:9200"

config.path = 'http://'
              + config.host
              + ':'
              + config.port;


module.exports = config;