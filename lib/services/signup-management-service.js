var Profile = require('../models/profile-model').Profile;
var ProfileManagementService = require('../services/profile-management-service');
var Role = require('../models/role-model').Role;

const Utils = require('../models/utilities');
const Errors = require('../security/errors');

var _validate = (newUserDetails) => {
  return new Promise(
    (resolve, reject) => {
      if(!newUserDetails.username || newUserDetails.username === undefined) { throw (Errors.emptyUserName); }
      if(!newUserDetails.role || newUserDetails.role === undefined) { throw (Errors.emptyRole); }

      Profile.findOne({'login.username': newUserDetails.username}).exec()
      .then(user => {
        if (user && user !== undefined) { resolve({exists: true, details: newUserDetails}); }
        return(Role.findOne({uuid: newUserDetails.role}).exec());
      })
      .then(role => {
        if (!role || role === undefined) { throw(Errors.invalidRoleUuid); }
        resolve({exists: false, details: newUserDetails});
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

exports.addNewUser = (newUserDetails) => {
  return new Promise(
    (resolve, reject) => {
      userAlreadyExists = false;
      _validate(newUserDetails)
      .then(validatedUser => {
        if (validatedUser.exists) {
          userAlreadyExists = true;
          // user with given details already exists. So return with user details.
          return(ProfileManagementService.getProfileByUsername(validatedUser.details.username));
        } else {
          // add a new user
          const uuid = Utils.getUuid();
          const timestamp = Utils.getTimestamp();
          const password = (!validatedUser.details.password || validatedUser.details.password === undefined || validatedUser.details.password === '') ? 'password' : validatedUser.details.password;

          var socialProfiles = [];
          if (validatedUser.details.socialProfiles && validatedUser.details.socialProfiles !== undefined) {
            validatedUser.details.socialProfiles.forEach(sp => {
              socialProfiles.push({
                socialNetworkName: sp.socialNetworkName,
                email: sp.email,
                details: sp.details,
              });
            });
          }

          var profileToSave = new Profile({
            uuid: uuid,
            created: { timestamp: timestamp, by: uuid, },
            lastModified: [{ timestamp: timestamp, by: uuid, },],
            status: 'new user',
            login: { username: validatedUser.details.username, password: password, },
            role: validatedUser.details.role,
            firstName: validatedUser.details.firstName,
            middleName: validatedUser.details.middleName,
            lastName: validatedUser.details.lastName,
            email: validatedUser.details.email,
            phoneNumber: validatedUser.details.phoneNumber,
            socialProfiles : socialProfiles,
          });
          return profileToSave.save();
        }
      })
      .then(profile => { resolve({exists: userAlreadyExists, profile: profile}); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};
