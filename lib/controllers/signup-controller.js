var SignupManagementService = require('../services/signup-management-service');
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
 *   "username" : "testing2345@gmail.com",
 *   "role": "e0ec7c05-3832-4080-a2c5-d63dfb0a7a17",
 *   "status": "new user",
 *   "socialNetwork": "facebook",
 *   "details": {
 *     "firstName" : "Pravallika",
 *     "middleName" : " ",
 *     "lastName" : "Ragipani",
 *     "gender" : "female",
 *     "username" : "testing2345@gmail.com"
 *   }
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
exports.addNewUser = function (req, res) {
  "use strict";
  if(!req.body || req.body === undefined) { throw (Errors.emptyRequestBody); }

  SignupManagementService.addNewUser(req.body)
  .then(newUserDTO => {
    console.info('in controller - added new user: %s %s - (%s)', newUserDTO.firstName, newUserDTO.lastName, newUserDTO.email);
    return res.status(201).send(newUserDTO);
  }).catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
