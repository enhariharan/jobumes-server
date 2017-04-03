var BasicAuth = require('basic-auth');
var Profile = require('../models/profile-model').Profile;
var Role = require('../models/role-model').Role;
var Utilities = require('../models/utilities');
var Errors = require('../security/errors');

const fs = require('fs');

var getProfileByUuid = (profileUuid) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {

      // Now get the results of the async queries and collect all results into the result DTO
      Profile.findOne({uuid: profileUuid}).exec()
      .then(p => {
        if (!p || p === undefined) { throw(Errors.userProfileCouldNotBeFound); }
        resolve(p);
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var getProfileByUser = (userUuid) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      // Now get the results of the async queries and collect all results into the result DTO
      Profile.findOne({user: userUuid}).exec()
      .then(p => {
        if (!p || p === undefined) { throw(Errors.userProfileCouldNotBeFound); }
        resolve(p);
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var getProfileByUsername = (username) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
    //  console.log("service");
      Profile.findOne({'login.username': username}).exec()
      .then(profile => {
      //  console.log('profile: %j',profile);
        resolve(profile); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var getProfileByAuthCredentials = (req) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      var credentials = new BasicAuth(req);
      getProfileByUsername(credentials.name)
      .then(profile => { resolve(profile); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var _validate = (profile) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      if (!profile.user || profile.user === undefined) { throw(Errors.userProfileCouldNotBeFound); }

      Profile.findOne({'login.username': profile.login.username})
      .then(user => {
        if (user && user !== undefined) { throw(Errors.duplicateUser); }
        return(Role.findOne({uuid: user.role}).exec());
      })
      .then(role => {
        if (!role || role === undefined) { throw(Errors.invalidRoleUuid); }
        resolve(profile);
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var addProfile = (profile) => {
  "use strict";

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
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

//For Changing the password
var changePassword = (credentials, cp) => {
  "use strict";

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
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var updateProfileImage = (profile, imageFile) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      // Make record of change for journaling
      var lastModified = {
        timestamp: Utilities.getTimestamp(),
        by: profile.uuid,
      };
      profile.lastModified.push(lastModified);

      // Read image into a buffer
      var image = {};
      image.fileName = imageFile.originalname;
      image.type = imageFile.mimetype;
      image.file = fs.readFileSync(imageFile.path);

      var query = {"uuid": profile.uuid};
      var update = {$set:{
        "lastModified": lastModified,
        "image.fileName": imageFile.originalname,
        "image.type": imageFile.mimetype,
        "image.file": image.file,
      }};
      var options = {new: true};

      Profile.findOneAndUpdate(query, update, options).exec()
      .then(updatedProfile => {
        var updatedProfileDto = {
          uuid: updatedProfile.uuid,
          lastModified: updatedProfile.lastModified,
          status: updatedProfile.status,
          role: updatedProfile.role,
          username: updatedProfile.login.username,
          firstName: updatedProfile.firstName,
          middleName: updatedProfile.firstName,
          lastName: updatedProfile.firstName,
          email: updatedProfile.email,
          phoneNumber: updatedProfile.phoneNumber,
          gender: updatedProfile.gender,
          image: {
            fileName: updatedProfile.image.fileName,
            type: updatedProfile.image.type,
          },
        };

        resolve(updatedProfileDto);
      })
      .catch(err => {
        console.log(err);
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var updateProfileVideo = (profile, videoFile) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      // Make record of change for journaling
      var lastModified = {
        timestamp: Utilities.getTimestamp(),
        by: profile.uuid,
      };
      profile.lastModified.push(lastModified);

      // Read video into a buffer
      var video = {};
      video.fileName = videoFile.originalname;
      video.type = videoFile.mimetype;
      video.file = fs.readFileSync(videoFile.path);

      var query = {"uuid": profile.uuid};
      var update = {$set:{
        "lastModified": lastModified,
        "video.fileName": videoFile.originalname,
        "video.type": videoFile.mimetype,
        "video.file": video.file,
      }};
      var options = {new: true};

      Profile.findOneAndUpdate(query, update, options).exec()
      .then(updatedProfile => {
        var updatedProfileDto = {
          uuid: updatedProfile.uuid,
          lastModified: updatedProfile.lastModified,
          status: updatedProfile.status,
          role: updatedProfile.role,
          username: updatedProfile.login.username,
          firstName: updatedProfile.firstName,
          middleName: updatedProfile.firstName,
          lastName: updatedProfile.firstName,
          email: updatedProfile.email,
          phoneNumber: updatedProfile.phoneNumber,
          gender: updatedProfile.gender,
          video: {
            fileName: updatedProfile.video.fileName,
            type: updatedProfile.video.type,
          },
        };

        resolve(updatedProfileDto);
      })
      .catch(err => {
        console.log(err);
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

module.exports = {getProfileByUuid, getProfileByUser, getProfileByUsername, getProfileByAuthCredentials,
  addProfile, changePassword, updateProfileImage, updateProfileVideo};
