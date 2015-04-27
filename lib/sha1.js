var crypto = require('crypto');

exports.sum = function(input) {
    return crypto.createHash('sha1').update(input.toString()).digest('hex');
}
