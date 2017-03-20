var utils = require('../models/utilities');
var ProfileManagementService = require('../services/profile-management-service');
var RoleManagementService = require('../services/role-management-service');
var Validator = require('../security/validator');
var BasicAuth = require('basic-auth');

/**
 * @api {get} /profiles Get all available profiles. Only admin role can access this URI.
 * @apiName getAllProfiles
 * @apiGroup Profile
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Profile[]} profiles Array of profiles.
 * @apiSuccessExample {json} Success-Response:
 */
exports.getAllProfiles = (req, res) => {
  "use strict";

  Validate input and exit in case of an error right now
  Validator.isUserAdmin(req)
  .then(result => { return ProfileManagementService.getAllProfiles() })
  .then(profiles => { return res.status('200').send(profiles); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

/**
 * @api {get} /profiles/:uuid Get profile by given uuid. Admin can access any uuid. Users can access only
 * their details by providing their profile uuid.
 * @apiName getProfile
 * @apiGroup Profile
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Profile[]} Profiles JSON array of 1 profile having given uuid.
 * @apiSuccessExample {json} Success-Response:
 */
exports.getProfile = (req, res) => {
  "use strict";
  Validator.isAuthorizedForGetProfileByUuid(req)
  .then(result => { return ProfileManagementService.getProfile(req.params.uuid); })
  .then(profile => { return res.status('200').send(profile); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

var _prepareToSave = (data) => {
  return new Promise(
    (resolve, reject) => {
      var profileDTO = {
        uuid: utils.getUuid(),
        timestamp: utils.getTimestamp(),
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        gender: data.gender,
        user: data.user
      };
      resolve(profileDTO);
  });
};

/**
 * @api {post} /profiles Add a new profile. Only admin can access this URI.
 * @apiName addProfile
 * @apiGroup Profile
 *
 * @apiParam (profile) {Profile} profile Give a profile as JSON
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 * @apiSuccess (201) {Profile} profile Created profile is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addProfile = (req, res) => {
  Validator.isValidCredentials(req)
  .then(result => {
    if (!req || !req.body) throw(errors.emptyRequestBody);
    return _prepareToSave(req.body);
  })
  .then(profileDTO => { return ProfileManagementService.addProfile(profileDTO); })
  .then(profile => {
    if (!profile || profile === undefined) throw(errors.errorWhileSavingProfile);
    console.log('saved profile: ' + JSON.stringify(profile.firstName));
    return res.status('201').send(profile);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
