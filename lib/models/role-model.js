var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = new Schema({
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},
  name: {type: String, required: true}
});

exports.Role = mongoose.model('Role', roleSchema);
