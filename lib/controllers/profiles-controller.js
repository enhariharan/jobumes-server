var utils = require('../models/utilities');
var ProfileManagementService = require('../services/profile-management-service');
var UserManagementService = require('../services/user-management-service');
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
 *    HTTP/1.1 200 OK
 *    {
 *      "profiles": [
 *        {
 *          "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *          "timestamp": "2016-12-30T12:32:20.819Z",
 *          "name": "Ashok Kumar",
 *          "type": "retail"
 *          "addresses" :
 *            [
 *              {
 *                "line1" : "123, ABC Road",
 *                "line2" : "DEF Blvd",
 *                "city" : "GHIJK City",
 *                "state" : "LM State",
 *                "countryCode" : "IN",
 *                "zipCode" : "NOPQRS",
 *                "latitude" : "100.01",
 *                "longitude" : "100.01",
 *                "type" : "work",
 *                "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *                "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *                "status" : "active",
 *                "_id" : ObjectId("5867518afc5bcb32f456f9c5") *              },
 *              },
 *              {
 *                "line1" : "Address line 1",
 *                "line2" : "Address line 2",
 *                "city" : "City name",
 *                "state" : "State Code",
 *                "countryCode" : "country Code",
 *                "zipCode" : "ZiPCoDe",
 *                "latitude" : "100.01",
 *                "longitude" : "100.01",
 *                "type" : "home",
 *                "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *                "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *                "status" : "active",
 *                "_id" : ObjectId("5867518afc5bcb32f456f9c5")
 *              },
 *            ]
 *        },
 *        {
 *          "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098612",
 *          "timestamp": "2016-12-28T12:32:20.819Z",
 *          "name": "Centilio",
 *          "type": "corporate"
 *        },
 *      ]
 *    }
 */
exports.getAllProfiles = (req, res) => {
  "use strict";

  // Validate input and exit in case of an error right now
  // Validator.isUserAdmin(req)
  // .then(result => {
  //   if (!result) throw (403);
  //   return ProfileManagementService.getProfileByAuthCredentials(req);
       ProfileManagementService.getProfileByAuthCredentials(req)
  // })
  .then(profile => {
    if (!profile || profile === undefined) return res.sendStatus(403);
    return ProfileManagementService.getAllProfilesByCorporate(profile.corporateName);
  })
  .then(context => {
    if (!context) return res.status('200').send('No profiles found in DB...');
    return res.status('200').send(context);
  })
  .catch(err => {
    if (err === 403 || err === 400) return res.sendStatus(err);
    return res.sendStatus('500');
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
 *   HTTP/1.1 200 OK
 *   {
 *     "profiles": [
 *       {
 *         "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *         "timestamp": "2016-12-30T12:32:20.819Z",
 *         "name": "Ashok Kumar",
 *         "type": "retail"
 *         "addresses" :
 *           [
 *             {
 *               "line1" : "123, ABC Road",
 *               "line2" : "DEF Blvd",
 *               "city" : "GHIJK City",
 *               "state" : "LM State",
 *               "countryCode" : "IN",
 *               "zipCode" : "NOPQRS",
 *               "latitude" : "100.01",
 *               "longitude" : "100.01",
 *               "type" : "work",
 *               "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *               "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *               "status" : "active",
 *               "_id" : ObjectId("5867518afc5bcb32f456f9c5") *              },
 *             },
 *             {
 *               "line1" : "Address line 1",
 *               "line2" : "Address line 2",
 *               "city" : "City name",
 *               "state" : "State Code",
 *               "countryCode" : "country Code",
 *               "zipCode" : "ZiPCoDe",
 *               "latitude" : "100.01",
 *               "longitude" : "100.01",
 *               "type" : "home",
 *               "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *               "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *               "status" : "active",
 *               "_id" : ObjectId("5867518afc5bcb32f456f9c5")
 *             },
 *           ]
 *         {
 *           "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098612",
 *           "timestamp": "2016-12-28T12:32:20.819Z",
 *           "name": "Centilio",
 *           "type": "corporate"
 *         },
 *       ]
 *     }
 */
exports.getProfile = (req, res) => {
  "use strict";
  Validator.isAuthorizedForGetProfileByUuid(req)
  .then(result => {
    if (!result) throw(403);
    return ProfileManagementService.getProfile(req.params.uuid);
  })
  .then(profile => {
    if (!profile || profile === undefined) return res.status('200').send('No profiles found in DB...');
    return res.status('200').send(profile);
  })
  .catch(err => {
    if (err === false || err === 403) return res.sendStatus(403);
    if (err) return res.status('500').send('error encountered while reading profile from DB' + err.stack);
  });
};

var _prepareToSave = (data) => {
  return new Promise(
    (resolve, reject) => {
      // copy everything from request body into a DTO object
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
 *        {
 *          "corporateName": "AB Inc",
 *          "firstName" : "John",
 *          "lastName" : "Doe",
 *          "type": "corporate",
 *          "addresses": [{
 *            "line1": "123, ABC Road",
 *            "line2": "DEF Blvd",
 *            "city": "GHIJK City",
 *            "state": "LM State",
 *            "countryCode": "IN",
 *            "zipCode": "NOPQRS",
 *            "latitude": "100.01",
 *            "longitude": "100.01",
 *            "type": "work"
 *          }],
 *          "emails": [{
 *            "email": "ashok.kumar@centilio.com",
 *            "type": "work"
 *          }],
 *          "contactNumbers": [{
 *            "number": "+919972012345",
 *            "type": "work"
 *          }],
 *          "role" : "user"
 *        }
 *
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
    if (!result || result === false) throw(403);
    if (!req || !req.body) throw(400);
    return _prepareToSave(req.body);
  })
  .then(profileDTO => { return ProfileManagementService.addProfile(profileDTO); })
  .then(profile => {
    if (!profile || profile === undefined) throw(500);
    console.log('saved profile: ' + JSON.stringify(profile.firstName));
    return res.status('201').send(profile);
  })
  .catch(err => {
    console.log('saving profile threw err: %s - %s', err, err.stack);
    if (err === false || err === 403) return res.sendStatus('403');
    if (err === 400) return res.sendStatus('400');
    return res.sendStatus('500');
  });
};
