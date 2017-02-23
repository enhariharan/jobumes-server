var BasicAuth = require('basic-auth');
var User = require('../models/user-model').User;
var UserManagementService = require('../services/user-management-service');
var RoleManagementService = require('../services/role-management-service');

var isValidCredentials = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = BasicAuth(req);
      if (credentials === undefined || !credentials) reject(403);
      User.findOne({username: credentials.name}).exec()
      .then(u => {
        if (!u || u === undefined
           || credentials.name.toLowerCase().localeCompare(u.username.toLowerCase())
           || credentials.pass.localeCompare(u.password)) reject(403);
        resolve(true);
      })
      .catch(err => {reject(err);});
  });
};

var isUserAdmin = (req) => {
  return new Promise(
    (resolve, reject) => {
      var credentials = BasicAuth(req);
      isValidCredentials(req)
      .then(result => {
        if (!result) reject(403);
        return UserManagementService.getUserByCredentials(credentials);
      })
      .then(user => {
        if (!user || user === undefined || !user.role || user.role === undefined) reject(403);
        return RoleManagementService.getRole(user.role);
      })
      .then(role => {
        if (!role || role === undefined || role.name !== 'admin') reject(403);
        resolve(true);
      })
      .catch(err => { reject(err); });
  });
};

module.exports = {isValidCredentials, isUserAdmin};
