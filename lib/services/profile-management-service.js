var BasicAuth = require('basic-auth');
var Profile = require('../models/profile-model').Profile;
var Role = require('../models/role-model').Role;
var Utilities = require('../models/utilities');
var Errors = require('../security/errors');

var getProfileByUuid = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {

      // Now get the results of the async queries and collect all results into the result DTO
      Profile.findOne({uuid: profileUuid}).exec()
      .then(p => {
        if (!p || p === undefined) {
          throw(Errors.userProfileCouldNotBeFound);
        }
        resolve(p);
      })
      .catch(err => {
        if (err.code === undefined) {
  reject({code: '500', reason: err});
}
        reject(err);
      });
  });
};

var getProfileByUser = (userUuid) => {
  return new Promise(
    (resolve, reject) => {
      // Now get the results of the async queries and collect all results into the result DTO
      Profile.findOne({user: userUuid}).exec()
      .then(p => {
        if (!p || p === undefined) {
          throw(Errors.userProfileCouldNotBeFound);
        }
        resolve(p);
      })
      .catch(err => {
        if (err.code === undefined) {
  reject({code: '500', reason: err});
}
        reject(err);
      });
  });
};

var getProfileByUsername = (username) => {
  return new Promise(
    (resolve, reject) => {
      Profile.findOne({'login.username': username}).exec()
      .then(profile => { resolve(profile); })
      .catch(err => {
        if (err.code === undefined) {
  reject({code: '500', reason: err});
}
        reject(err);
      });
  });
};

var getProfileByAuthCredentials = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = new BasicAuth(req);
      getProfileByUsername(credentials.name)
      .then(profile => { resolve(profile); })
      .catch(err => {
        if (err.code === undefined) {
  reject({code: '500', reason: err});
}
        reject(err);
      });
  });
};

var _validate = (profile) => {
  return new Promise(
    (resolve, reject) => {
      if (!profile.user || profile.user === undefined) {
        throw(Errors.userProfileCouldNotBeFound);
      }

      Profile.findOne({'login.username': profile.login.username})
      .then(user => {
        if (user && user !== undefined) {
          throw(Errors.duplicateUser);
        }
        return(Role.findOne({uuid: user.role}).exec());
      })
      .then(role => {
        if (!role || role === undefined) {
          throw(Errors.invalidRoleUuid);
        }
        resolve(profile);
      })
      .catch(err => {
        if (err.code === undefined) {
  reject({code: '500', reason: err});
}
        reject(err);
      });
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
        if (err.code === undefined) {
  reject({code: '500', reason: err});
}
        reject(err);
      });
  });
};

//For Changing the password
var changePassword = (credentials, cp) => {
  return new Promise(
    (resolve, reject) => {
        var query = {"login.username": cp.username};
        var update = {$set:{"login.password":cp.newpassword}};
          Profile.findOneAndUpdate(query, update).exec()
      .then(savedPassword => {
        console.log("this is  savedPassword: "+savedPassword);
        resolve(savedPassword);
      })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err});
        }
        reject(err);
      });
  });
};

module.exports = {getProfileByUuid, getProfileByUser, getProfileByUsername, getProfileByAuthCredentials,
  addProfile, changePassword};
