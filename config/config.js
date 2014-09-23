var config = {
  "host"  : "localhost",
  "port"  : 4050,
  "path"  : "http://localhost:4050/"
};

config.elastic = {
  db : {
    "host"  : "http://" + config.host + ":9200"
  }
};

module.exports = config;