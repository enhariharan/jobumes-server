var BasicAuth = require('basic-auth');
var Validator = require('../security/validator');
var UserManagementService = require('../services/user-management-service');
var ProfileManagementService = require('../services/profile-management-service');
var utilities = require('../models/utilities');


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
    "username" : "testing2345@gmail.com",
    "role": "0850685a-70c6-4776-a24b-e51d4522573a",
    "status": "new user",
    "socialnetwork": "facebook",
    "detailsinjson": "[{'FirstName':'Pravallika',MiddleName':' ','Lastname':'Ragipani','Gender':'Male','Username':'testing2345@gmail.com'}]"
  }
 *
 * @apiSuccess (201) {User} user Created user is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (400) {String} BadRequest Error code 400 is returned if the username already exists.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addNewUser = function (req, res) {
  "use strict";
  if(!req.body || req.body === undefined) throw {

  }
  // Get the credentials
  var credentials = BasicAuth(req);  // TODO: Change this to JWT based stateless token based authentication

  var userdetails = {};
  userdetails.username = req.body.username;
  userdetails.role = req.body.role;
  userdetails.status = req.body.status;
  userdetails.socialnetwork = req.body.socialnetwork;
  userdetails.detailsinjson = req.body.detailsinjson;
  userdetails.firstName = req.body.firstName;
  userdetails.lastName = req.body.lastName;
  userdetails.middleName = req.body.middleName;
  userdetails.gender = req.body.gender;
  userdetails.profilePicPath = req.body.profilePicPath;
  console.log("userdetails: "+userdetails.username);
  UserManagementService.addNewUser(credentials, userdetails)
  .then(savedUser => {
    console.info('in controller - added new user: ' + JSON.stringify(savedUser.username));
    return res.status(201).send(savedUser);
  }).catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
