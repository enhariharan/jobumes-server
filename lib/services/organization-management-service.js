var Organization = require('../models/organization-model').Organization;

exports.getAllOrganizations = () => {
  return new Promise(
    (resolve, reject) => {
      Organization.find()
       .then(orgs => { resolve(orgs); })
       .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};

exports.addNewOrganization = (org) => {
  return new Promise(
    (resolve, reject) => {
      var orgToSave = new Organization(org);
      orgToSave.save()
      .then(savedOrg => { resolve(savedOrg); })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err});
        }
        reject(err);
      });
  });
};
