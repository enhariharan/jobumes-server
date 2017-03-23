var Profile = require('../models/profile-model').Profile;
var Role = require('../models/role-model').Role;

const Utils = require('../models/utilities');
const Errors = require('../security/errors');

var _validate = (newUserDetails) => {
  return new Promise(
    (resolve, reject) => {
      if(!newUserDetails.username || newUserDetails.username === undefined) {
        throw (Errors.emptyUserName);
      }
      if(!newUserDetails.role || newUserDetails.role === undefined) {
        throw (Errors.emptyRole);
      }

      Profile.findOne({'login.username': newUserDetails.username}).exec()
      .then(user => {
        if (user && user !== undefined) {
          throw(Errors.duplicateUserName);
        }
        return(Role.findOne({uuid: newUserDetails.role}).exec());
      })
      .then(role => {
        if (!role || role === undefined) {
          throw(Errors.invalidRoleUuid);
        }
        resolve(newUserDetails);
      })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err});
        }
        reject(err);
      });
  });
};

exports.addNewUser = (newUserDetails) => {
  return new Promise(
    (resolve, reject) => {
      _validate(newUserDetails)
      .then(validateduserdetails => {
        const uuid = Utils.getUuid();
        const timestamp = Utils.getTimestamp();
        const password = (!validateduserdetails.password || validateduserdetails.password === undefined || validateduserdetails.password === '') ? 'password' : validateduserdetails.password;
        const phoneNumber = (!validateduserdetails.phonenumber || validateduserdetails.phonenumber === undefined || validateduserdetails.phonenumber === '') ? '0000000000' : validateduserdetails.phonenumber;
        var socialProfiles = [];
        socialProfiles.push({
          socialNetworkName: validateduserdetails.socialnetwork,
          email: validateduserdetails.username,
          details: validateduserdetails.details,
        });

        var profileToSave = new Profile({
          uuid: uuid,
          created: { timestamp: timestamp, by: uuid, },
          lastModified: [{ timestamp: timestamp, by: uuid, },],
          status: 'new user',
          role: validateduserdetails.role,
          login: { username: validateduserdetails.username, password: password, },
          firstName: validateduserdetails.details.firstName,
          middleName: validateduserdetails.details.middleName,
          lastName: validateduserdetails.details.lastName,
          email: validateduserdetails.details.email,
          phoneNumber: phoneNumber,
          gender: validateduserdetails.details.gender,
          socialProfiles : socialProfiles,
        });

        return profileToSave.save();
      })
      .then(savedProfile => { resolve(savedProfile); })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err});
        }
        reject(err);
      });
  });
};
