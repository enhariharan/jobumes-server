var BasicAuth = require('basic-auth');
var Profile = require('../models/profile-model').Profile;
var ProfileManagementService = require('../services/profile-management-service');
var RoleManagementService = require('../services/role-management-service');
var Errors = require('./errors');

var _isSuperAdmin = (credentials) => {
  return (credentials.name.toLowerCase().localeCompare('jobumesadmin') === 0 && credentials.pass.localeCompare('12hbd76!') === 0);
};

var isValidCredentials = (req) => {
  return new Promise(
    (resolve, reject) => {
      if (!req || req === undefined) { throw(Errors.emptyRequestBody); }

      // Try with social credentials
      // How does login by social work?
      // The UI is first expected to validate social login in the UI.
      // If that passes then UI must call GET /login with these HTTP request headers set -
      // "source" must be set to "facebook" or "google" or other network as appropriate
      // "user" must be set to the email use at the social login
      if (req.headers.source && req.headers.source !== undefined &&
          req.headers.user && req.headers.user !== undefined) {
        Profile.find({}, {uuid:1, login:1, socialProfiles:1}).exec()
        .then(profiles => {
          var found = false;
          profiles.forEach(p => {
            if (p.login.username === req.headers.user) {
              console.log('profile found: %j', p);
                console.log('p.socialProfiles: %j', p.socialProfiles);
              p.socialProfiles.forEach(s => {
                console.log('social profiles: %j', s);
                if (s.socialNetworkName === req.headers.source && s.email === req.headers.user) {
                    found = true;
                    resolve(true); // credentails have been verified, exit now
                  }
              })
            }
          })
          if (found === false) { throw(Errors.invalidCredentials); }
        })
      } else {
        // Try with basic-auth credentials
        var credentials = new BasicAuth(req);
        if (!credentials || credentials === undefined) { throw(Errors.invalidCredentials); }
        if (_isSuperAdmin(credentials)) { resolve(true); }

        Profile.findOne({'login.username': credentials.name}).exec()
        .then(u => {
          if (!u || u === undefined || credentials.name.toLowerCase().localeCompare(u.login.username.toLowerCase()) || credentials.pass.localeCompare(u.login.password)) {
            throw(Errors.invalidCredentials);
          }

          resolve(true);
        })
        .catch(err => {reject(err);});
      }
  });
};

var isUserAdmin = (req) => {
  return new Promise(
    (resolve, reject) => {
      isValidCredentials(req)
      .then(result => {
        var credentials = new BasicAuth(req);
        if (_isSuperAdmin(credentials)) { resolve(true); }
        if (!result) { throw(Errors.invalidCredentials); }
        return ProfileManagementService.getProfileByAuthCredentials(req);
      })
      .then(user => {
        if (!user || user === undefined) {
          throw(Errors.invalidCredentials);
        }
        if (!user.role || user.role === undefined) {
          throw(Errors.invalidCredentialsRoleNotAdmin);
          }
        return RoleManagementService.getRole(user.role);
      })
      .then(role => {
        if (!role || role === undefined || role.name !== 'admin') {
          throw(Errors.invalidCredentialsRoleNotAdmin);
        }
        resolve(true);
      })
      .catch(err => { reject(err); });
  });
};

var isUserRecruiter = (req) => {
  return new Promise(
    (resolve, reject) => {
      isValidCredentials(req)
      .then(result => {
        var credentials = new BasicAuth(req);
        if (_isSuperAdmin(credentials)) { resolve(true); }
        if (!result) { throw(Errors.invalidCredentials); }
        return ProfileManagementService.getProfileByAuthCredentials(req);
      })
      .then(user => {
        if (!user || user === undefined) {
          throw(Errors.invalidCredentials);
        }
        if (!user.role || user.role === undefined){
          throw(Errors.invalidCredentialsRoleNotRecruiter);
        }
        if (!user.role || user.role === undefined) {
          throw(Errors.invalidCredentialsRoleNotRecruiter);
        }
       return RoleManagementService.getRole(user.role);
      })
      .then(role => {
        if (!role || role === undefined || role.name !== 'recruiter') {
          throw(Errors.invalidCredentialsRoleNotRecruiter);
        }
        resolve(true);
      })
      .catch(err => { reject(err); });
  });
};

module.exports = {isValidCredentials, isUserAdmin, isUserRecruiter};
