var utils = require('../models/utilities');
var ProfileManagementService = require('../services/profile-management-service');
var Validator = require('../security/validator');
var BasicAuth = require('basic-auth');
var Errors = require('../security/errors');

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
//jshint unused:false
exports.getAllProfiles = (req, res) => {
  "use strict";

  // Validate input and exit in case of an error right now
  Validator.isUserAdmin(req)
  .then(result => { return ProfileManagementService.getAllProfiles(); })
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
//jshint unused:false
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

//jshint unused:false
var _prepareToSave = (data) => {
  "use strict";

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
//jshint unused:false
exports.addProfile = (req, res) => {
  "use strict";

  Validator.isValidCredentials(req)
  .then(result => {
    if (!req || !req.body) {
      throw(Errors.emptyRequestBody);
    }
    return _prepareToSave(req.body);
  })
  .then(profileDTO => { return ProfileManagementService.addProfile(profileDTO); })
  .then(profile => {
    if (!profile || profile === undefined) {
      throw(Errors.errorWhileSavingProfile);
    }
    console.log('saved profile: ' + JSON.stringify(profile.firstName));
    return res.status('201').send(profile);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};


// Code for Change password
//jshint unused:false
exports.changePassword = function (req, res) {
  "use strict";

  // Get the credentials
  var credentials = new BasicAuth(req);  // TODO: Change this to JWT based stateless token based authentication
  console.log("request body: %s", JSON.stringify(req.body));
  var cp = {};
  cp.username = req.body.username;
  cp.newpassword= req.body.password;

  console.log("credentials: "+cp.username+" , password:"+cp.newpassword);

  Validator.isValidCredentials(req)
  .then(result =>{
    return ProfileManagementService.changePassword(credentials, cp);
  })
  .then(savedPassword => {
    console.info('in controller - updated password for the employee: ' + JSON.stringify(savedPassword.uuid));
    return res.sendStatus(200);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

/**
 * @api {put} /profiles/image Update the image of the profile of logged in user.
 * @apiName addProfile
 * @apiGroup Profile
 *
 * @apiParam (credentials) {credentials} credentials Logged in users credentials provided as BasicAuth headers
 * @apiParam (image) {image} image Image to be attached to this profile, provided as a form-date in request-body. The image file must be uploaded with the key "file".
 * @apiSuccess (200) {Profile} profile Updated profile is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError (403) {String} AuthenticationError Error code 403 is returned if credentials are incorrect.
 * @apiError (400) {String} BadRequest Error code 400 is returned if request-body format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.updateProfileImage = (req, res) => {
  "use strict";

  Validator.isValidCredentials(req)
  .then(result => {
    return ProfileManagementService.getProfileByAuthCredentials(req); })
  .then(profile => {
    // console.log('profile from controller: : %j',profile);
    return ProfileManagementService.updateProfileImage(profile, req.file); })
  .then(updatedProfile => {
    console.info('updatedProfile: %j' + updatedProfile);
    return res.sendStatus(200).send(updatedProfile);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
