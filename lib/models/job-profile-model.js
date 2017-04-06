var mongoose = require('mongoose');
var schema   = mongoose.Schema;
var Job = require('./job-model');
var Profile = require('./profile-model');

// This schema stores the information about which user applied for which job.
var jobProfileSchema = schema({
  uuid: {type: String, required: [true, 'uuid is required']},
  created: {
    timestamp: {type: Date, required: [true, 'creation timestamp is required']}, // timestamp
    by: {type: String, ref: 'Profile'}, // profile uuid of creator
  },
  lastModified: [{
    timestamp: {type: Date, required: [true, 'modified timestamp is required']}, // timestamp
    by: {type: String, ref: 'Profile'}, // profile uuid of modifier
  },],
  job: {type: String, ref: 'Job'},
  profile: {type: String, ref: 'Profile'},
  status: {type: String, required: [true, 'job application status is required']}, // 'saved', 'applied', ...
});

exports.JobProfile  = mongoose.model('JobProfile', jobProfileSchema);
