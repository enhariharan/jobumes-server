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
      Profile.findOne({'login.username': username},{"uuid":1,"created":1,"lastModified":1,"status":1,"role":1,
    "login.username":1,"firstName":1,"middleName":1,"lastName":1,"email":1,"phoneNumber":1,"gender":1,"socialProfiles":1}).exec()
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
      // If social credentials are present then try to find profile by social credentials
      // else try to find profile by BasicAuth credentials
      if (req.headers.source && req.headers.source !== undefined && req.headers.user && req.headers.user !== undefined) { // social login
        getProfileByUsername(req.headers.user)
        .then(profile => { resolve(profile); })
        .catch(err => {
          if (err.code === undefined) { reject({code: '500', reason: err}); }
          reject(err);
        });
      }
      else { // BasicAuth login
        var credentials = new BasicAuth(req);
        getProfileByUsername(credentials.name)
        .then(profile => { resolve(profile); })
        .catch(err => {
          if (err.code === undefined) { reject({code: '500', reason: err}); }
          reject(err);
        });
      }
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
      image.path = imageFile.path;

      var query = {"uuid": profile.uuid};
      var update = {$set:{
        "lastModified": lastModified,
        "image.fileName": imageFile.originalname,
        "image.type": imageFile.mimetype,
        "image.file": image.file,
        "image.imagePath": image.path
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
            imagePath: updatedProfile.image.imagePath
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
      video.path = videoFile.path;

      var query = {"uuid": profile.uuid};
      var update = {$set:{
        "lastModified": lastModified,
        "video.fileName": videoFile.originalname,
        "video.type": videoFile.mimetype,
        "video.file": video.file,
        "video.videoPath": video.path
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
            videoPath : updatedProfile.video.videoPath
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

var getProfileVideo = (username) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
    //  console.log("service");
      Profile.findOne({'login.username': username},{"uuid":1,"video.fileName":1,"video.videoPath":1}).exec()
      .then(profile => {
        // console.log('profile: %j',profile);
        resolve(profile); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var getProfileImage = (username) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
    //  console.log("service");
      Profile.findOne({'login.username': username},{"uuid":1,"image.fileName":1,"image.imagePath":1}).exec()
      .then(profile => {
        // console.log('profile: %j',profile);
        resolve(profile); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

//For updating savejobs
var saveJobs = (username, saveJob) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      var query = {'login.username': username};
      var getFields = {"uuid":1,"created":1,"lastModified":1,"status":1,"role":1,
    "login.username":1,"firstName":1,"middleName":1,"lastName":1,"email":1,"phoneNumber":1,"gender":1,"socialProfiles":1,"savedJobs":1};
      var existingArray = [];
      var update = "";
      Profile.findOne(query,getFields).exec()
      .then(queryResult =>{
        // console.log('queryResult :: %j',queryResult);
        existingArray = queryResult.savedJobs;
        existingArray.push(saveJob);
        // for(var i=0;i<=existingArray.length;i++){
        //   console.log("existingArray:: "+i+" "+existingArray[i]);
        // }
        update = {$set:{"savedJobs":existingArray}};
        return Profile.findOneAndUpdate(query,update).exec()
      })
      .then(savedJobs => {
        // console.log("this is  savedJobs: "+savedJobs);
        resolve(savedJobs);
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};


var getSavedJobs = (username) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
    //  console.log("service");
      Profile.findOne({'login.username': username},{"uuid":1,"savedJobs":1}).exec()
      .then(profile => {
        // console.log('profile: %j',profile);
        resolve(profile); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};


module.exports = {getProfileByUuid, getProfileByUser, getProfileByUsername, getProfileByAuthCredentials,
  addProfile, changePassword, updateProfileImage, updateProfileVideo, getProfileVideo, getProfileImage,
  saveJobs, getSavedJobs};
