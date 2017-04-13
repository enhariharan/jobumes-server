var Job = require('../models/job-model').Job;
var Profile = require('../models/profile-model').Profile;
var Errors = require('../security/errors');
var ProfileManagementService = require('../services/profile-management-service');

// jshint: unused: false
var _getQuery = (queryParams) => {
  return new Promise(
    (resolve, reject) => {
      if (queryParams.period < 0) {resolve({});}
      else {
        const periodInMs = Number(queryParams.period)*24*60*60*1000;
        const toDate = new Date();
        const fromDate = new Date(toDate - periodInMs);
        const query = {timestamp : {$lte:toDate, $gte:fromDate}};
        resolve(query);
      }
  });
};

var _getJobsCountDto = (moInfoNeeded, jobs) => {
  return new Promise(
    (resolve, reject) => {
      if (jobs.length === 0) { resolve({jobsCount: 0}); }
      else if (moInfoNeeded === false) { resolve({jobsCount: jobs.length}); }
      else resolve(_getMoreInfoForJobsCount(jobs));
  });
};

var _getMoreInfoForJobsCount = (jobs) => {
  return new Promise(
    (resolve, reject) => {
        var returnJobsDTO = {};
        returnJobsDTO.jobsCount = jobs.length;
        returnJobsDTO.details = [];
        var i = 0;
        jobs.forEach(job => {
          i++;
          var obj = {};
          // add  employer details
          // add job details
          _getEmployerDetails(job.profile)
          .then(employerObj => {
              // console.log("jobApplicant more info: %j",employerObj);
            obj.employerDetails = employerObj;
            obj.jobUuid = job.uuid;
            obj.timestamp = job.timestamp;
            obj.name = job.name;
            obj.status = job.status;
            obj.parsedJson = job.parsedJson;
            returnJobsDTO.details.push(obj);
            if (i == returnJobsDTO.jobsCount) { resolve(returnJobsDTO); }

            })
            .catch(err => {throw err;});

        });
  });
};

var _getEmployerDetails = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
     //  console.log("profile Uuid:: "+profileUuid);
   ProfileManagementService.getProfileByUuid(profileUuid)
    .then(empDetails => {
       //  console.log('applicant details from get applicant details: %j',empDetails);
      resolve(empDetails);
    });
  });
};

exports.getAllJobsPosted = (queryParams) => {
  return new Promise(
    (resolve, reject) => {
      _getQuery(queryParams)
      .then(query => {
        console.info('query: %j', query);
        const fieldsNeeded = {"uuid":1,"timestamp":1,"name":1,"status":1,"parsedJson":1,"profile":1};
        return Job.find(query, fieldsNeeded).exec();
      })
      .then(jobs => {
        console.log('jobs %j',jobs);
        return _getJobsCountDto(queryParams.moreInfo, jobs); })
      .then(dto => {
        console.log('dto:: %j',dto);
        resolve(dto); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
}


exports.getProfilesByRole = (periodDate,roleUuid) => {
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
