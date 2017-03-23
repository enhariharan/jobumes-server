var BasicAuth = require('basic-auth');

var utils = require('../models/utilities');
var Validator = require('../security/validator');
var Errors = require('../security/errors');

var JobsManagementService = require('../services/jobs-management-service');
const ProfileManagementService = require('../services/profile-management-service');
const ResumeManagementService = require('../services/resume-management-service');

var _validate = (req) => {
  return new Promise((resolve, reject) => {
    if (!req || !req.body || req.body === undefined || req.body.length === 0) {
      reject(Errors.emptyRequestBody);
    }
    if (!req || !req.file || req.file === undefined || req.file.length === 0) {
      reject(Errors.noJDFileSentForUpload);
    }

    resolve();
  });
};

/**
 * @api {post} /jobs Add a new job.
 * @apiName addJob
 * @apiGroup Job
 *
 * @apiParam (job) {Job} Give job URL as JSON
 * @apiParam (credentials) {Credentials} Send username and password for authentication as Request-header (Basic-auth)
 * @apiParam (content-type) {ContentType} Send "Content-type:application/json" as Request-header
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 * {
 *   "url": "http://183.82.1.143:9058/jobumes/jobs/Manager.docx",
 *   "name": "Engineering Manager",
 * }
 *
 * {
 *   "url": "http://183.82.1.143:9058/jobumes/jobs/Developer.docx",
 *   "name": "Software Developer",
 * }
 *
 * @apiSuccess (201) {Job} job Job object added is sent back.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "uuid: 65c03e18-4fee-44cd-b3d2-acad224b5648,
 *   "timestamp: 2017-02-23T17:24:30.977Z,
 *   "url": "http://183.82.1.143:9058/jobumes/jobs/Developer.docx",
 *   "name": "Software Developer",
 *   "status": "active",
 *   "parsedJson": {...},
 * },
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
//jshint unused:false
exports.addJob = (req, res) => {
  var profile = null;
  Validator.isValidCredentials(req)
  .then(result => {
    var credentials = new BasicAuth(req);
    return ProfileManagementService.getProfileByUsername(credentials.name);
  })
  .then((verifiedProfile) => {
    // console.log('req.file: %j\n', req.file);
    // console.log('req.body: %j\n', req.body);
    if (!verifiedProfile || verifiedProfile === undefined) {
      throw(Errors.invalidCredentials);
    }
    profile = verifiedProfile;
    return _validate(req);
  })
  .then(() => {
    var jobDto = {};
    jobDto.uuid = utils.getUuid();
    jobDto.timestamp  = utils.getTimestamp();
    jobDto.name = req.file.originalname;
    jobDto.type = req.file.mimetype;
    jobDto.status = 'active';
    jobDto.file = '';
    jobDto.parsedJson = '';
    jobDto.profile = profile.uuid;

    return JobsManagementService.addJob(jobDto, req.file);
  })
  .then(savedJob => {
    console.info('saved job: %j', savedJob);
    if (!savedJob || savedJob === undefined) {
      throw(Errors.errorWhileSavingJob);
    }
    return res.status('201').send(savedJob);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

/**
 * @api {get} /jobs Get all jobs.
 * @apiName getAllJobs
 * @apiGroup Job
 *
 * @apiParam (credentials) {Credentials} Send username and password for authentication as Request-header (Basic-auth)
 * @apiParam (content-type) {ContentType} Send "Content-type:application/json" as Request-header
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.
 *
 * @apiSuccess (201) {Job} job Job object added against the Profile is sent back.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [{
 *   "uuid: 65c03e18-4fee-44cd-b3d2-acad224b5648,
 *   "timestamp: 2017-02-23T17:24:30.977Z,
 *   "url": "http://183.82.1.143:9058/jobumes/jobs/Developer.docx",
 *   "name": "Software Developer",
 *   "status": "active",
 *   "parsedJson": {...},
 * },
 * {
 *   "uuid: 65c03e18-4fee-44cd-b3d2-acad224b5648,
 *   "timestamp: 2017-02-23T17:24:30.977Z,
 *   "url": "http://183.82.1.143:9058/jobumes/jobs/Manager.docx",
 *   "name": "Engineering Manager",
 *   "status": "closed",
 *   "parsedJson": {...},
 * }]
 *
 * @apiError (403) {String} AuthenticatioFailed Error code 403 is returned if credentials are incorrect.
 */
//jshint unused:false
exports.getAllJobs = (req, res) => {
  "use strict";
  if (!req || !req.body) {
    throw(Errors.emptyRequestBody);
  }
  Validator.isValidCredentials(req)
  .then(result => {
    return ProfileManagementService.getProfileByAuthCredentials(req);
  })
  .then(profile => {
    return JobsManagementService.getJobsByProfile(profile.uuid);
  })
  .then(jobs => {
    console.log("jobs count: "+jobs.length);
    return res.status('200').send(jobs);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

// Get all job applicants
exports.getAllJobApplicants = (req, res) => {
  "use strict";
  var jobApplicantsDTO = [];
  if (!req || !req.body) throw(Errors.emptyRequestBody);
  Validator.isUserRecruiter(req)
  .then(result => {
    return ProfileManagementService.getProfileByAuthCredentials(req) })
  .then(profile => {
    return JobsManagementService.getJobsByProfileAndJobUuid(profile.uuid,req.body.jobuuid); })
  .then(job => {
    if(!job || job === undefined) throw (Errors.unauthorisedRecruiterAccessToJob);
    return JobsManagementService.getApplicantsByJob(req.body.jobuuid);
  })
  .then(applicants => {
    console.log("applicants count: "+applicants.length);

    for(var i=0;i<=applicants.length;i++){

      var jobApplicant = {};
      var applicantProfile = {};var applicantResume = {};
      applicantProfile = ProfileManagementService.getProfileByUuid(applicants[i].profile);
      console.log("applicantProfile: "+applicantProfile);
      applicantResume = ResumeManagementService.getResumesByProfileAndResumeUuid(applicants[i].profile,applicants[i].resume);
      console.log("applicants resume: "+applicantResume);

      jobApplicant.profileId = applicants[i].profile;
      jobApplicant.appliedOn = applicants[i].appliedOn;
      jobApplicant.resume = applicants[i].resume;
      jobApplicant.userName = applicantProfile.login.username;
      jobApplicant.mainSkill = applicantResume.name;

      console.log('jobApplicant: %s', JSON.stringify(jobApplicant));
      jobApplicantsDTO.push(jobApplicant);
    }
    return res.status('200').send(jobApplicantsDTO); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });

};
