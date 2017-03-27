var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var jobApplicantsSchema = Schema({
  uuid: {type: String, required: [true, 'job applicants uuid is required']},
  timestamp: {type: Date, required: [true, 'job applicants creation timestamp is required']},
  applicants:[{
    profile: {type: Array, ref: 'Profile'},
    appliedOn : {type: Date, required: [true, 'job applicants applied timestamp is required']},
    resume : {type: String, ref: 'Resume'}
  }],
  job: {type: String, ref: 'Job'},


  });

exports.JobApplicant  = mongoose.model('JobApplicant', jobApplicantsSchema);
