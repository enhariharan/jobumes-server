var BasicAuth = require('basic-auth');

var Validator = require('../security/validator');
var utils = require('../models/utilities');

var AdminService = require('../services/admin-service');
var RoleManagementService = require('../services/role-management-service');
var ProfileManagementService = require('../services/profile-management-service');
/**
 * @api {get} / Get all jobs posted
 * @apiName getAllJobsPosted
 * @apiGroup Jobs
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Jobs[]} Jobs Array of Jobs.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "roles":
 *     [
 *       {
 *         "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *         "timestamp": "2016-12-30T12:32:20.819Z",
 *         "name": "admin",
 *         "status": "active"
 *       },
 *       {
 *         "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *         "timestamp": "2016-12-30T12:32:20.819Z",
 *         "name": "recruiter",
 *         "status": "active"
 *       },
 *       {
 *         "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *         "timestamp": "2016-12-30T12:32:20.819Z",
 *         "name": "jobseeker",
 *         "status": "active"
 *       },
 *     ]
 * }
 */

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

exports.getAllJobsPosted = (req, res) => {
  "use strict";

  var moInfoNeeded = (req.query.moreInfo === 'true') ? true : false;
  console.log("moInfoNeeded:: "+moInfoNeeded);
  var period = req.query.period;
  // var period = req.query.period - '0';
  console.log("period = "+period);

  var returnJobsDTO = [];
  var jobsArray = [];
  var returnJobsCount = {};

  var current_date = new Date();

  var periodDate = "";
  if(period == "total"){
    periodDate = "total";
  }else{
    periodDate = current_date.setDate(current_date.getDate() - Number(period));
  }
  console.log("current_date:: "+periodDate);

  Validator.isUserAdmin(req)
  .then(result => {
    return AdminService.getAllJobsPosted(periodDate);
  })
  .then(jobs => {
    return new Promise(
      (resolve, reject) => {
        var i = 0;
        var m = jobs.length;
      console.log("applicants count: "+jobs.length);

    jobs.forEach(a => {
            i++;

         if(moInfoNeeded === true){
           var employerDTO = {};
           _getEmployerDetails(a.profile)
           .then(employerObj => {
               // console.log("jobApplicant more info: %j",employerObj);
             employerDTO.employerDetails = employerObj;
             employerDTO.jobUuid = a.uuid;
             employerDTO.timestamp = a.timestamp;
             employerDTO.name = a.name;
             employerDTO.status = a.status;
             employerDTO.parsedJson = a.parsedJson;

             returnJobsDTO.push(employerDTO);

              console.log("length of jobs array : "+jobs.length);
              if(i === m){
                 // console.log("jobApplicantsDTO more info: "+returnJobsDTO[0]);
                returnJobsCount.jobsCount = jobs.length;
                returnJobsDTO.push(returnJobsCount);
                resolve(returnJobsDTO);
              }
             })
             .catch(err => {throw err;});
         }else{
           if(i === m){
              // console.log("jobApplicantsDTO more info: "+returnJobsDTO[0]);
             returnJobsCount.jobsCount = jobs.length;
             returnJobsDTO.push(returnJobsCount);
             resolve(returnJobsDTO);
           }
         }

    });

  });
  })
  .then(returnJobsDTO => {
    // console.log('job applicants dto: %j',returnJobsDTO);
    return res.status('200').send(returnJobsDTO);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
