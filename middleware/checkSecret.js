
var secrets = require('../ctcue-config/cUMLS').secrets;
var _ = require('lodash');

module.exports = function *(next) {
  var error = false;

  // Check application secret (currently in "ctcue-config")
  // Later on this could be your ctcue secret key/identity?
  if (!!this.request.body && this.request.body.hasOwnProperty('secret')) {
    var found = _.findIndex(secrets, { 'code' : this.request.body.secret })

    if (~found) {
      return yield next;
    }
  }

  this.body = {
    'error' : true,
    'msg'   : 'Please provide a valid secret token.'
  }
};
