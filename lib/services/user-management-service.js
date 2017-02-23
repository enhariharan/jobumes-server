var User = require('../models/user-model').User,
    Profile = require('../models/profile-model').Profile,
    Utilities = require('../models/utilities');

exports.getUserByCredentials = (credentials) => {
  return new Promise(
    function(resolve, reject) {
      User.findOne({username: credentials.name}).exec()
      .then(user => {
        console.info('user: %s', JSON.stringify(user));
          if (!user || user === undefined) reject(400);
          var userDTO = {
            username: user.username,
            profile: user.profile,
            role: user.role
          };
          resolve(userDTO);
      })
      .catch(err => { reject(err); });
  });
};

exports.getUserByUuid = (uuid) => {
  return new Promise(
    function(resolve, reject) {
      User.findOne({uuid: uuid}).exec()
      .then(user => {
          if (!user || user === undefined) reject(400);
          var userDTO = {
            username: user.username,
            role: user.role
          };
          resolve(userDTO);
      })
      .catch(err => {
        console.log('err - %s - %s', err, err.stack);
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

      User.findOne({username: credentials.name}).exec()
      .then(user => {
        console.log('\nfound credentials for user: ' + credentials.name);
        if (!user || user === undefined) reject('400 - ' + credentials.name +' is already present.');
        var userToSave = new User({
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          username: credentials.name,
          password: credentials.pass,
          role: newUserDetails.role,
          status: 'new user',
        });
        return userToSave.save();
      })
      .then(savedEmail => {
        resolve(newUserDetails);
      })
      .catch(err => {
        console.log('\naddNewuser() resulted in error : ' + JSON.stringify(err) + ' ' + err);
        reject(err);
      });
  });
};
