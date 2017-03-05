var BasicAuth = require('basic-auth');
var Validator = require('../security/validator');
var ProfileManagementService = require('../services/profile-management-service');
var UserManagementService = require('../services/user-management-service');

/**
 * @api {get} /login login into the service
 * @apiName login
 * @apiGroup User
 *
 * @apiParam (user) {Credentials} credentials Credentials sent as authentication headera
 *
 * @apiSuccess (200) {Client} client client object matching the credentials.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "_id": "58af1acecbf84c70d79bf1c1",
 *   "uuid": "65c03e18-4fee-44cd-b3d2-acad224b5648",
 *   "timestamp": "2017-02-23T17:24:30.977Z",
 *   "firstName": "Surya",
 *   "lastName": "Vempati",
 *   "middleName": "",
 *   "gender": "male",
 *   "user": "bdb03337-862a-4ba8-a9ec-f92cec1bc4f7",
 *   "__v": 0
 * }
 */
exports.login = function (req, res) {
  "use strict";

  // Get the credentials
  var credentials = BasicAuth(req);

  // validate if the user is present and passwords match
  // if match found, send back profile details
  // if match not found, send error code 400 or 500 as needed
  Validator.isValidCredentials(req)
  .then(result => {
    if (!result || result === undefined) throw(403);
    return UserManagementService.getUserByCredentials(credentials)
  })
  .then(user => {
    console.info('user: %s', JSON.stringify(user));
    if (!user || user === undefined) throw(403);
    return ProfileManagementService.getProfileByUser(user.uuid);
  })
  .then(profile => {
    console.info('profile: %s', JSON.stringify(profile));
    if (!profile || profile === undefined) throw(500);
    res.status(200).send(profile);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
