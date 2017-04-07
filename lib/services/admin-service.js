var Job = require('../models/job-model').Job;
var Errors = require('../security/errors');

exports.getAllJobsPosted = () => {
  return new Promise(
    (resolve, reject) => {
      Job.find({},{"uuid":1,"timestamp":1,"name":1,"status":1,"parsedJson":1,"profile":1}).exec()
       .then(jobs => { resolve(jobs); })
       .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};
