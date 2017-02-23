var BasicAuth = require('basic-auth');
var Validator = require('../security/validator');
var UserManagementService = require('../services/user-management-service');
var ProfileManagementService = require('../services/profile-management-service');
var utilities = require('../models/utilities');

exports.getUserByUuid = (req, res) => {
  "use strict";

  UserManagementService.getUserByUuid(req.params.uuid)
  .then(user => {
    console.info('\nuser (%s) found', user.username);
    res.status(200).send(user);
  })
  .catch(err => {
    console.error('\nerr - %s - %s', err, err.stack);
    res.sendStatus(err);
  });
}

/**
 * @api {get} /users Get all users.
 * @apiName getAllUsers
 * @apiGroup User
 *
 * @apiParam {json} Request-header must contain the credentials of logged in user.
 *
 * @apiSuccess (200) {User[]} devices Array of users.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 */
 exports.getAllUsers = (req, res) => {
  "use strict";

  Validator.isValidCredentials(req)
  .then(result => {
    console.info('\nresult 1: ' + JSON.stringify(result));
    if (result) return UserManagementService.getAllUsers();
    else return {};
  })
  .then(users => {
    console.info('\nusers: ' + JSON.stringify(users));
    return res.status(200).send(users);
  })
  .catch(err => {
    console.error('\nerr: %s', JSON.stringify(err) + err.stack);
    return res.sendStatus(err);
  });
};

/**
 * @api {post} /users Add a new user
 * @apiName addUser
 * @apiGroup User
 *
 * @apiParam (user) {Credentials} credentials Credentials of the logged in user
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.
 *                  {json} Request-header Basic Authentication details must ne set. This should be changed to
 *                         stateless JWT based token based authentication.
 *                  {json} Request-body should send the new user name, passsword, role type in the following format.
 * {
 *   "firstName": "John",
 *   "lastName": "Woo",
 *   "email": "john.woo@centil.io",
 *   "password": "password", // TODO: This should be changed to stateless JWT based token based authentication.
 *   "role": "83356361-e0a4-4942-98b8-1a1c8ad4c943"
 * }
 *
 * @apiSuccess (201) {User} user Created user is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (400) {String} BadRequest Error code 400 is returned if the username already exists.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addUser = function (req, res) {
  "use strict";
  var UserAlreadyPresentException = {};

  // Get the credentials
  var credentials = BasicAuth(req);  // TODO: Change this to JWT based stateless token based authentication

  UserManagementService.addUser(credentials, req.body)
  .then(user => {
    console.info('in controller - added new user: ' + JSON.stringify(user));
    return res.sendStatus(201);
  }).catch(err => {
    console.error('in controller - err occured while adding new user: ' + JSON.stringify(err));
    return res.sendStatus(err);
  });
};
