var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var industryTypeSchema = Schema({
  uuid: {type: String, required: true},
  timestamp: {type: Date, required: true},
  name: {type: String, required: true}
});

exports.IndustryType = mongoose.model('IndustryType', industryTypeSchema);
