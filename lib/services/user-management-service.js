var User = require('../models/user-model').User;
var Profile = require('../models/profile-model').Profile;
var Utilities = require('../models/utilities');
var SocialProfile = require('../models/socialprofile-model').SocialProfile;
var Errors = require('../security/errors');

exports.getUserByCredentials = (credentials) => {
  return new Promise(
    function(resolve, reject) {
      User.findOne({username: credentials.name}).exec()
      .then(user => {
          if (!user || user === undefined) throw(Errors.userCouldNotBeFound);
          var userDTO = {
            uuid: user.uuid,
            username: user.username,
            profile: user.profile,
            role: user.role
          };
          resolve(userDTO);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};

exports.getUserByUsername = (username) => {
  return new Promise(
    function(resolve, reject) {
      User.findOne({username: username}).exec()
      .then(user => {
          if (!user || user === undefined) throw(Errors.userCouldNotBeFound);
          var userDTO = {
            uuid: user.uuid,
            username: user.username,
            profile: user.profile,
            role: user.role
          };
          resolve(userDTO);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};

exports.getUserByUuid = (uuid) => {
  return new Promise(
    function(resolve, reject) {
      User.findOne({uuid: uuid}).exec()
      .then(user => {
          if (!user || user === undefined) throw(Errors.userCouldNotBeFound);
          var userDTO = {
            username: user.username,
            role: user.role
          };
          resolve(userDTO);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};

exports.addUser = (credentials, newUserDetails) => {
  return new Promise(
    (resolve, reject) => {
      var clientToSave = null;
      var userToSave = null;
      var emailToSave = null;

      User.findOne({username: newUserDetails.username,phonenumber:newUserDetails.phonenumber}).exec()
      .then(user => {
        if (user || user !== undefined) throw(Errors.userCouldNotBeFound);
        var userToSave = new User({
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          username: newUserDetails.username,
          password: newUserDetails.password,
          phonenumber: newUserDetails.phonenumber,
          role: newUserDetails.role,
          status: 'new user',
        });
      //  console.log("userToSave: "+userToSave);
        return userToSave.save();
      })
      .then(savedUser => {
      //  console.log("this is saved Email: "+savedUser);
        resolve(savedUser);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};

exports.addFbUser = (credentials, newUserDetails) => {
  return new Promise(
    (resolve, reject) => {
      var userToSave = null;
      var socialprofileToSave = null;
      var profileToSave = null;

      User.findOne({username: newUserDetails.username,phonenumber:newUserDetails.phonenumber}).exec()
      .then(user => {
        // console.info('user: %s', JSON.stringify(user));
        console.log("new user details: "+newUserDetails.username+"role: "+newUserDetails.role);
        if (user && user !== undefined) throw({code: '400', reason: 'Username already Exists..!!'});
        var userToSave = new User({
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          username: newUserDetails.username,
          password: "password",
          phonenumber: "0000000000",
          role: newUserDetails.role,
          status: 'new user'
        });
       console.log("userToSave: "+userToSave);
        return userToSave.save();
      })
      .then(savedUser => {
        console.log("savedUser: "+savedUser);
        var socialprofileToSave = new SocialProfile({
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          socialnetwork: newUserDetails.socialnetwork,
          socialnetworkemail: newUserDetails.username, // TODO: BCrypt hash that is stored here.
          detailsinjson: newUserDetails.detailsinjson,
          user: savedUser.uuid
        });
        console.log("socialprofileToSave: "+socialprofileToSave);
        return socialprofileToSave.save();
      })
      .then(savedUser => {
        var profileToSave = new Profile({
            uuid: Utilities.getUuid(),
            timestamp: Utilities.getTimestamp(),
            firstName: newUserDetails.firstName,
            lastName: newUserDetails.lastName,
            middleName: newUserDetails.middleName,
            gender: newUserDetails.gender,
            profilePicPath : newUserDetails.profilePicPath,
            user: savedUser.uuid
        });
        console.log("profile To Save: "+profileToSave);
        return profileToSave.save();
      })
      .then(savedUser => {
        console.log("this is saved Email: "+savedUser);
        resolve(savedUser);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};
