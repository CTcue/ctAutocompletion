
var request = require('request-json');

exports.post = function(path, obj) {
  var reqClient = request.newClient(path);

  return function(callback) {
    reqClient.post("", obj, function(err, res, body) {
      callback(err, body);
***REMOVED***);
  ***REMOVED***;
***REMOVED***;