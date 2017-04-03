var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var functionalAreaSchema = Schema({
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},
  name: {type: String, required: true}
});

exports.FunctionalArea = mongoose.model('FunctionalArea', functionalAreaSchema);
