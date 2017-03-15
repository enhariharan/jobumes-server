var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var resumeSchema = Schema({
  uuid: {type: String, required: [true, 'resume uuid is required']},
  timestamp: {type: Date, required: [true, 'creation timestamp is required']},
  url: {type: String, required: [true, 'resume url is required']},
  name: {type: String},
  status: {type: String, required: [true, 'resume status is required']}, // can be "active", "inactive"
  parsedJson: {type: Object, required: [true, 'parsed resume content cannot be null']},
  profile: {type: String, ref: 'Profile'},
});

exports.Resume  = mongoose.model('Resume', resumeSchema);
