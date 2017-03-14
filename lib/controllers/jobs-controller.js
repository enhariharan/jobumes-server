var BasicAuth = require('basic-auth');

var utils = require('../models/utilities');
var Validator = require('../security/validator');
var Errors = require('../security/errors');

var JobsManagementService = require('../services/jobs-management-service');

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
exports.addJob = (req, res) => {
  if (!req || !req.body) throw(Errors.emptyRequestBody);

  Validator.isValidCredentials(req)
  .then(result => {
    var credentials = BasicAuth(req);
    return ProfileManagementService.getProfileByUsername(credentials.name);
  })
  .then(profile => {
    if (!profile || profile === undefined) throw(Erorrs.userProfileCouldNotBeFound);

    var jobDto = {};
    jobDto.uuid = utils.getUuid();
    jobDto.timestamp  = utils.getTimestamp();
    jobDto.url = req.body.url;
    jobDto.name = req.body.name;
    jobDto.status = 'active';
    jobDto.parsedJson = '';

    return JobsManagementService.addJob(jobDto);
  })
  .then(savedJob => {
    console.info('saved job: %s', JSON.stringify(savedJob));
    if (!savedJob || savedJob === undefined) throw(Erorrs.errorWhileSavingJob);
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
exports.getAllJobs = (req, res) => {
  if (!req || !req.body) throw(Errors.emptyRequestBody);

  Validator.isValidCredentials(req)
  .then(result => { return ProfileManagementService.getProfileByAuthCredentials(req) })
  .then(profile => { return JobsManagementService.getJobs(profile.uuid); })
  .then(jobs => { return res.status('201').send(jobs); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
