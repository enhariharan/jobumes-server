var Profile = require('../models/profile-model').Profile;
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
        if (user && user !== undefined) { resolve(true, newUserDetails); }
        return(Role.findOne({uuid: newUserDetails.role}).exec());
      })
      .then(role => {
        if (!role || role === undefined) { throw(Errors.invalidRoleUuid); }
        resolve(false, newUserDetails);
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
      userAlreadyExistsFlag = false;
      _validate(newUserDetails)
      .then((userAlreadyExists, validateduserdetails) => {
        if (userAlreadyExists) {
          userAlreadyExistsFlag = true;
          // user with given details already exists. So return with user details.
          return(ProfileManagementService.getProfileByUsername(validateduserdetails.username));
        } else {
          // add a new user
          const uuid = Utils.getUuid();
          const timestamp = Utils.getTimestamp();
          const password = (!validateduserdetails.password || validateduserdetails.password === undefined || validateduserdetails.password === '') ? 'password' : validateduserdetails.password;
          var socialProfiles = [];
          validateduserdetails.socialProfiles.forEach(sp => {
            socialProfiles.push({
              socialNetworkName: sp.socialNetworkName,
              email: sp.email,
              details: sp.details,
            });
          });

          var profileToSave = new Profile({
            uuid: uuid,
            created: { timestamp: timestamp, by: uuid, },
            lastModified: [{ timestamp: timestamp, by: uuid, },],
            status: 'new user',
            login: { username: validateduserdetails.username, password: password, },
            role: validateduserdetails.role,
            firstName: validateduserdetails.firstName,
            middleName: validateduserdetails.middleName,
            lastName: validateduserdetails.lastName,
            email: validateduserdetails.email,
            phoneNumber: validateduserdetails.phoneNumber,
            socialProfiles : socialProfiles,
          });
          return profileToSave.save();
        }
      })
      .then(profile => { resolve(userAlreadyExistsFlag, profile); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};
