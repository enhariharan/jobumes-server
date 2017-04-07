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
     //  console.log('applicant details from get applicant details: %j',applicant);
    ProfileManagementService.getProfileByUuid(profileUuid)
     .then(empDetails => {
       resolve(empDetails);
     });
   });
 };

exports.getAllJobsPosted = (req, res) => {
  "use strict";
  var returnJobsDTO = [];
  var returnJobsCount = {};
  Validator.isUserAdmin(req)
  .then(result => {
    console.log("period = "+req.params.period);
    return AdminService.getAllJobsPosted();
  })
  .then(jobs => {
    return new Promise(
      (resolve, reject) => {
        var i = 0;
        var m = jobs.length;
     console.log("applicants count: "+jobs.length);
    jobs.forEach(a => {
       console.log("applicant: "+a.profile);
      i++;
      var employerDTO = {};
      _getEmployerDetails(a.profile)
      .then(employerObj => {
         console.log("jobApplicant: %j",employerObj);
        employerDTO.employerDetails = employerObj;
        employerDTO.jobUuid = a.uuid;
        employerDTO.timestamp = a.timestamp;
        employerDTO.name = a.name;
        employerDTO.status = a.status;
        employerDTO.parsedJson = a.parsedJson;

        returnJobsDTO.push(employerDTO);

        console.log("length: "+returnJobsDTO.length);
        if(i === m){
          console.log("jobApplicantsDTO: "+returnJobsDTO[0]);
          returnJobsCount.jobsCount = m;
          returnJobsDTO.push(returnJobsCount);
          resolve(returnJobsDTO);
        }
        })
      .catch(err => {throw err;});
    });

  });
  })
  .then(returnJobsDTO => {
    console.log('job applicants dto: %j',returnJobsDTO);
    return res.status('200').send(returnJobsDTO);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

/**
 * @api {post} /roles Add a new role
 * @apiName addRole
 * @apiGroup Role
 *
 * @apiParam (role) {Role} Role Give a role as JSON
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 * {
 *   "name": "jobseeker"
 * }
 *
 * @apiSuccess (201) {Role} Role Created role is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "uuid": "88b28115-b859-452c-9fb4-5323c9ed69e6",
 *   "timestamp": 1483166090614,
 *   "name": "jobseeker"
 * }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
 //jshint unused:false
exports.addRole = (req, res) => {
  if (!req || !req.body) {
    return res.status(400).send('Bad Request');
  }

  Validator.isUserAdmin(req)
  .then(result => {
    var role = {
      uuid: utils.getUuid(),
      timestamp: utils.getTimestamp(),
      name: req.body.name,
      status: 'active',
    };

    return RoleManagementService.addRole(role);
  })
  .then(savedRole => { return res.status('201').send(savedRole); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
