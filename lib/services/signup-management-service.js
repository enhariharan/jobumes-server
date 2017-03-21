var User = require('../models/user-model').User;
var Profile = require('../models/profile-model').Profile;
var Role = require('../models/role-model').Role;
var Utilities = require('../models/utilities');
var SocialProfile = require('../models/socialprofile-model').SocialProfile;
var Errors = require('../security/errors');

var _validate = (newUserDetails) => {
  return new Promise(
    (resolve, reject) => {
      if(!newUserDetails.username || newUserDetails.username === undefined) throw (Errors.emptyUserName);
      if(!newUserDetails.role || newUserDetails.role === undefined) throw (Errors.emptyRole);
      User.findOne({username: newUserDetails.username}).exec()
      .then(user => {
          if (user && user !== undefined) throw(Errors.duplicateUserName);
          return(Role.findOne({uuid: newUserDetails.role}).exec());
      })
      .then(role => {
          if (!role || role === undefined) throw(Errors.invalidRoleUuid);
          resolve(newUserDetails);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
    });
};

exports.addNewUser = (newUserDetails) => {
  return new Promise(
    (resolve, reject) => {
    var newUserDTO = {};
      _validate(newUserDetails)
      .then(validateduserdetails => {
        var user = {
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          username: newUserDetails.username,
          status: 'new user'
        };
        if (!newUserDetails.password || newUserDetails.password === undefined || newUserDetails.password === '')
            user.password = 'password';
          else
            user.password = newUserDetails.password;

        if (!newUserDetails.phonenumber || newUserDetails.phonenumber === undefined || newUserDetails.phonenumber === '')
            user.phonenumber = '0000000000';
          else
            user.phonenumber = newUserDetails.phonenumber;

        var userToSave = new User(user);
        return userToSave.save();
      })
      .then(savedUser => {
        newUserDTO.user = savedUser;
        var userdetails = "";
        if (!newUserDetails.detailsinjson || newUserDetails.detailsinjson === undefined || newUserDetails.detailsinjson === '')
            userdetails = '';
          else
            userdetails = newUserDetails.detailsinjson;

        var profileToSave = new Profile({
            uuid: Utilities.getUuid(),
            timestamp: Utilities.getTimestamp(),
            firstName: userdetails.firstName,
            lastName: userdetails.lastName,
            middleName: userdetails.middleName,
            gender: userdetails.gender,
            profilePicPath : userdetails.profilePicPath,
            user: savedUser.uuid
        });
        return profileToSave.save();
      })
      .then(savedProfile => {
        newUserDTO.profile = savedProfile;

        var socialprofileToSave = new SocialProfile({
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          socialnetwork: newUserDetails.socialnetwork,
          socialnetworkemail: newUserDetails.username, // TODO: BCrypt hash that is stored here.
          detailsinjson: newUserDetails.detailsinjson,
          profile: savedProfile.uuid
        });
        return socialprofileToSave.save();
      })
      .then(savedSocialProfile => {
        newUserDTO.socialProfile = savedSocialProfile;
        resolve(newUserDTO);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};
