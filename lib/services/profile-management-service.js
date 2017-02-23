var BasicAuth = require('basic-auth');
var Profile = require('../models/profile-model').Profile;
var User = require('../models/user-model').User;
var Role = require('../models/role-model').Role;
var Utilities = require('../models/utilities');
var Validator = require('../security/validator');
var RoleManagementService = require('./role-management-service');
var UserManagementService = require('./user-management-service');

var getProfileByUuid = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
      // initialize the query result that will be sent back
      var profileDTO = {
        uuid: '',
        timestamp: null,
        firstName: '',
        lastName: '',
        middleName: '',
        type: '',
        role: ''
       };

      // Now get the results of the async queries and collect all results into the result DTO
      Profile.findOne({uuid: profileUuid}).exec()
      .then(p => {
        if (p === null) resolve(profileDTO);
        _fillDtoWithProfileDetails(profileDTO, p);
        resolve(profileDTO);
      })
      .catch(err => { reject(err); });
    }
  );
}

var getProfileByUsername = (username) => {
  return new Promise(
    (resolve, reject) => {
      UserManagementService.getUserByCredentials({name: username})
      .then(user => { return getProfileByUuid(user.profile); })
      .then(profile => { resolve(profile); })
      .catch(err => { reject(err); });
  });
}

var getProfileByAuthCredentials = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = BasicAuth(req);
      getProfileByUsername(credentials.name)
      .then(profile => { resolve(profile); })
      .catch(err => { reject(err); });
  });
}

var _validate = (profile) => {
  return new Promise(
    (resolve, reject) => {
      if (!profile.user || profile.user === undefined) reject(400);

      UserManagementService.getUserByUuid(profile.user)
      .then(user => {
        if (!user || user === undefined) reject(400);
        resolve(profile);
      })
      .catch(err => { reject(err); });
  });
};

var addProfile = (profile) => {
  return new Promise(
    (resolve, reject) => {
      _validate(profile)
      .then(validProfile => {
        return new Profile({
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          firstName: validProfile.firstName,
          lastName: validProfile.lastName,
          middleName: validProfile.middleName,
          gender: validProfile.gender,
          role: validProfile.role,
          user: validProfile.user,
        }).save();
      })
      .then(result => { resolve(result); })
      .catch(err => {
        console.log('\naddProfile().err - %s: %s', err, err.stack);
        reject(err);
      });
  });
}

module.exports = {getProfileByUuid, getProfileByUsername, getProfileByAuthCredentials, addProfile};
