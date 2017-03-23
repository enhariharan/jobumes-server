var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var jobSchema = new Schema({
  uuid: {type: String, required: [true, 'job uuid is required']},
  timestamp: {type: Date, required: [true, 'job creation timestamp is required']},
  name: {type: String, required: [true, 'JD file name is required']},
  type: {type: String, required: [true, 'JD file type is required']},
  file: {type: Buffer, required: [true, 'JD file contents is required']},
  status: {type: String, required: [true, 'job status is required']}, // can be "active", "closed"
  parsedJson: {type: Object, required: [true, 'parsed job content cannot be null']},
  profile: {type: String, ref: 'Profile'}
});

exports.Job  = mongoose.model('Job', jobSchema);
