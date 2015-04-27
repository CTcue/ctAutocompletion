
var request = require('request-json');

exports.post = function(path, obj) {
  var reqClient = request.createClient(path);

  return function(callback) {
    reqClient.post("", obj, function(err, res, body) {
      callback(err, body);
    });
  };
};