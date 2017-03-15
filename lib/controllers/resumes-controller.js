var BasicAuth = require('basic-auth');

var utils = require('../models/utilities');
var Validator = require('../security/validator');
var Errors = require('../security/errors');

var ProfileManagementService = require('../services/profile-management-service');
var ResumeManagementService = require('../services/resume-management-service');

/**
 * @api {post} /resumes Add a new resume to the profile.
 * @apiName addResume
 * @apiGroup Resume
 *
 * @apiParam (resume) {Resume} Give resume URL as JSON
 * @apiParam (credentials) {Credentials} Send username and password for authentication as Request-header (Basic-auth)
 * @apiParam (content-type) {ContentType} Send "Content-type:application/json" as Request-header
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 * {
 *   "url": "http://183.82.1.143:9058/jobumes/resumes/Arun.docx",
 *   "name": "Arun CV 1",
 * }
 *
 * {
 *   "url": "http://183.82.1.143:9058/jobumes/resumes/Narasimha.docx",
 *   "name": "Narasimha CV",
 * }
 *
 * @apiSuccess (201) {Resume} resume Resume object added against the Profile is sent back.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addResume = (req, res) => {
  if (!req || !req.body) throw(Errors.emptyRequestBody);

  Validator.isValidCredentials(req)
  .then(result => {
    var credentials = BasicAuth(req);
    return ProfileManagementService.getProfileByUsername(credentials.name);
  })
  .then(profile => {
    if (!profile || profile === undefined) throw(Erorrs.userProfileCouldNotBeFound);

    var resumeDto = {};
    resumeDto.uuid = utils.getUuid();
    resumeDto.timestamp  = utils.getTimestamp();
    resumeDto.url = req.body.url;
    resumeDto.name = req.body.name;
    resumeDto.status = 'active';
    resumeDto.parsedJson = '';
    resumeDto.profile = profile;

    return ResumeManagementService.addResume(resumeDto);
  })
  .then(savedResume => {
    console.log('saved resume: %j', savedResume);
    if (!savedResume || savedResume === undefined) throw(Erorrs.errorWhileSavingResume);
    return res.status('201').send(savedResume);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

/**
 * @api {get} /resumes Get all resumes for a profile.
 * @apiName getAllResumes
 * @apiGroup Resume
 *
 * @apiParam (credentials) {Credentials} Send username and password for authentication as Request-header (Basic-auth)
 * @apiParam (content-type) {ContentType} Send "Content-type:application/json" as Request-header
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.
 *
 * @apiSuccess (201) {Resume} resume Resume object added against the Profile is sent back.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [{
 *   "uuid: {type: String, required: [true, 'profile uuid is required']},
 *   "timestamp: {type: Date, required: [true, 'creation timestamp is required']},
 *   "url": "http://183.82.1.143:9058/jobumes/resumes/Arun.docx",
 *   "name": "Arun CV 1",
 *   "status: "active",
 *   "parsedJson: {type: String, required: [true, 'parsed content cannot be null']},
 *   "profile: {type: String, ref: 'Profile'}
 * },
 * {
 *   "uuid: {type: String, required: [true, 'profile uuid is required']},
 *   "timestamp: {type: Date, required: [true, 'creation timestamp is required']},
 *   "url": "http://183.82.1.143:9058/jobumes/resumes/Arun2.docx",
 *   "name": "Arun CV 2",
 *   "status: "active",
 *   "parsedJson: {type: String, required: [true, 'parsed content cannot be null']},
 *   "profile: {type: String, ref: 'Profile'}
 * }]
 *
 * @apiError (403) {String} AuthenticatioFailed Error code 403 is returned if credentials are incorrect.
 */
exports.getAllResumes = (req, res) => {
  if (!req || !req.body) throw(Errors.emptyRequestBody);

  Validator.isValidCredentials(req)
  .then(result => { return ProfileManagementService.getProfileByAuthCredentials(req) })
  .then(profile => { return ResumeManagementService.getResumesByProfile(profile.uuid); })
  .then(resumes => { return res.status('201').send(resumes); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
