var Job = require('../models/job-model').Job;
var Errors = require('../security/errors');

exports.getAllJobsPosted = (periodDate) => {
  return new Promise(
    (resolve, reject) => {
      console.log("period date:: "+periodDate);
      var curDate = new Date(periodDate);
      var query;
      if(periodDate == "total"){
        query = {};
      }else{
        var FromDate = curDate.getFullYear()+"-"+curDate.getMonth()+"-"+curDate.getDate();
        query = {timestamp:{$lte:new Date(),$gte: FromDate}};
      }

      console.log("new Date(current_date):: "+FromDate);
      Job.find(query,{"uuid":1,"timestamp":1,"name":1,"status":1,"parsedJson":1,"profile":1}).exec()
       .then(jobs => {
        //  console.log('jobs from service:: %j',jobs);
         resolve(jobs); })
       .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};
