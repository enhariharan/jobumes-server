var uuid = require('uuid/v4');

exports.getUuid = function() { return uuid(); };
exports.getTimestamp = function() { return Date.now(); };
