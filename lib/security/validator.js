var BasicAuth = require('basic-auth');
var User = require('../models/user-model').User;
var UserManagementService = require('../services/user-management-service');
var RoleManagementService = require('../services/role-management-service');
var Errors = require('../security/errors');

var _isSuperAdmin = (credentials) => {
  return (credentials.name.toLowerCase().localeCompare('jobumesadmin') === 0
          && credentials.pass.localeCompare('12hbd76!') === 0);
};

var isValidCredentials = (req) => {
  return new Promise(
    (resolve, reject) => {
      if (!req.body || req.body === undefined)
        throw(Errors.emptyRequestBody);

      var credentials = BasicAuth(req);
      if (!credentials || credentials === undefined) throw(Errors.invalidCredentials);
      if (_isSuperAdmin(credentials)) resolve(true);

      User.findOne({username: credentials.name}).exec()
      .then(u => {
        if (!u || u === undefined
           || credentials.name.toLowerCase().localeCompare(u.username.toLowerCase())
           || credentials.pass.localeCompare(u.password)) throw(Errors.invalidCredentials);

        resolve(true);
      })
      .catch(err => {reject(err);});
  });
};

var isUserAdmin = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = BasicAuth(req);
      console.info('%j', credentials);
      isValidCredentials(req)
      .then(result => {
        if (_isSuperAdmin(credentials)) resolve(true);
        if (!result) throw(Errors.invalidCredentials);
        return UserManagementService.getUserByCredentials(credentials);
      })
      .then(user => {
        if (!user || user === undefined)
          throw(Errors.invalidCredentials);
        if (!user.role || user.role === undefined)
          throw(Errors.invalidCredentialsRoleNotAdmin);

        return RoleManagementService.getRole(user.role);
      })
      .then(role => {
        if (!role || role === undefined || role.name !== 'admin')
          throw(Errors.invalidCredentialsRoleNotAdmin);
        resolve(true);
      })
      .catch(err => { reject(err); });
  });
};

module.exports = {isValidCredentials, isUserAdmin};
