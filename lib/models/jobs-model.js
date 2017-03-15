var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var jobSchema = Schema({
  uuid: {type: String, required: [true, 'job uuid is required']},
  timestamp: {type: Date, required: [true, 'job creation timestamp is required']},
  url: {type: String, required: [true, 'job url is required']},
  name: {type: String},
  status: {type: String, required: [true, 'job status is required']}, // can be "active", "closed"
  parsedJson: {type: Object, required: [true, 'parsed job content cannot be null']},
});

exports.Job  = mongoose.model('Job', jobSchema);
