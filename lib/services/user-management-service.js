var User = require('../models/user-model').User;
var Profile = require('../models/profile-model').Profile;
var Utilities = require('../models/utilities');
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

      User.findOne({username: newUserDetails.username}).exec()
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
