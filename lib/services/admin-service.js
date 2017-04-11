var Job = require('../models/job-model').Job;
var Profile = require('../models/profile-model').Profile;
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

exports.getAllProfilesAsPerRole = (periodDate,roleUuid) => {
  return new Promise(
    (resolve, reject) => {
      console.log("period date:: "+periodDate);
      var curDate = new Date(periodDate);
      var query;
      if(periodDate == "total"){
        query = {role:roleUuid};
      }else{
        var FromDate = curDate.getFullYear()+"-"+curDate.getMonth()+"-"+curDate.getDate();
        query = {timestamp:{$lte:new Date(),$gte: FromDate},role:roleUuid};
        console.log("new Date(current_date):: "+FromDate);
      }
      Profile.find(query,{"uuid":1,"created":1,"lastModified":1,"status":1,"role":1,
    "login.username":1,"firstName":1,"middleName":1,"lastName":1,"email":1,"phoneNumber":1,"gender":1,"socialProfiles":1}).exec()
       .then(profiles => {
          // console.log('profiles from service:: %j',profiles);
         resolve(profiles); })
       .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};
