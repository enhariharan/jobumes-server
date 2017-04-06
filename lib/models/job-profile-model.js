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
  job: {type: String, ref: 'Job'},
  profile: {type: String, ref: 'Profile'},
  saved: {type: Date, required: [false]}, // save the timestamp when user clicked on save
  applied: {type: Date, required: [false]} // save the timestamp when user clicked on apply
});

exports.JobProfile  = mongoose.model('JobProfile', jobProfileSchema);
