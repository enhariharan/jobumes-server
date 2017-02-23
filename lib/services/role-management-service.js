var Role = require('../models/role-model').Role,
    User = require('../models/user-model').User;

exports.getAllRoles = (callback) => {
  return new Promise(
    (resolve, reject) => {
      Role.find()
       .then(roles => { resolve(roles); })
       .catch(err => {
         console.error('error while reading roles from DB: %s: %s ', err, err.stack);
         reject(err);
       });
  });
}

exports.getRole = (roleUuid) => {
  return new Promise(
    (resolve, reject) => {
      Role.findOne({'uuid': roleUuid})
      .then(role => {
        if (role === undefined || !role) reject(err || 400);
        resolve(role);
      })
      .catch(err => {
        console.log('RoleManagementService.getRole() returning err ' + err);
        reject(err);
      });
  });
}

exports.getRoleByUsername = (username) => {
  return new Promise(
    (resolve, reject) => {
      User.findOne({'username': username}).exec()
      .then(user => {return Role.findOne({'uuid': user.role}).exec();})
      .then(role => {
        if (role === undefined || !role) reject(err || 400);
        resolve(role);
      })
      .catch(err => {reject(err);})
  });
}

exports.getRoleByProfile = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
      Client.findOne({'uuid': profileUuid})
      .then(profile => {
        if (profile === undefined || !profile) reject(err || 400);
        return Role.findOne({'uuid': profile.role}).exec();
      })
      .then(role => {
        if (role === undefined || !role) reject(err || 400);
        resolve(role);
      })
      .catch(err => {reject(err);})
  });
}

exports.addRole = (role) => {
  return new Promise(
    (resolve, reject) => {
      var roleToSave = new Role(role);
      roleToSave.save()
      .then(savedRole => { resolve(savedRole); })
      .catch(err => { reject(err); })
  });
}

exports.getRoleByName = (roleName) => {
  return new Promise(
    (resolve, reject) => {
      console.info('rolename: ' + JSON.stringify(roleName));
      Role.findOne({name: roleName})
     .then(role => { resolve(role); })
     .catch(err => { reject(err); })
  })
}
