var BasicAuth = require('basic-auth');
var Validator = require('../security/validator');
var SignupManagementService = require('../services/signup-management-service');
var ProfileManagementService = require('../services/profile-management-service');
var utilities = require('../models/utilities');
var Errors = require('../security/errors');


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
 if(!req.body || req.body === undefined) throw (Errors.emptyRequestBody);
 var req_body = {};
 req_body.username = req.body.username;
 req_body.role = req.body.role;
 req_body.status = req.body.status;
 req_body.socialnetwork = req.body.socialnetwork;
 req_body.detailsinjson = req.body.detailsinjson;


  console.log("userdetails: "+req_body.username);
  SignupManagementService.addNewUser(req_body)
  .then(newUserDTO => {
    console.info('in controller - added new user: %j' ,newUserDTO.username);
    return res.status(201).send(newUserDTO);
  }).catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
