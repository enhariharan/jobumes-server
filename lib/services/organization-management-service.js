var Organization = require('../models/organization-model').Organization;
const Utilities = require('../models/utilities');
const fs = require('fs');

exports.getAllOrganizations = () => {
  return new Promise(
    (resolve, reject) => {
      Organization.find({},{"uuid":1,"name":1,"status":1,"description":1,"address":1,"internet":1,
    "email":1,"phone":1,"socialProfile":1,"logo.fileName":1,"logo.type":1,"logo.uri":1})
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

exports.updateLogo = (profile,orgUuid, imageFile) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      // Make record of change for journaling
      var lastModified = {
        timestamp: Utilities.getTimestamp(),
        by: profile.uuid,
      };
      // Organization.lastModified.push(lastModified);
      console.log('lastModified:: %j',lastModified);
      // Read image into a buffer
      var image = {};
      image.fileName = imageFile.originalname;
      image.type = imageFile.mimetype;
      image.file = fs.readFileSync(imageFile.path);
      image.path = imageFile.path;

      var query = {"uuid": orgUuid};
      var update = {$set:{
        "lastModified": lastModified,
        "logo.fileName": imageFile.originalname,
        "logo.type": imageFile.mimetype,
        "logo.file": image.file,
        "logo.uri": image.path
      }};
      var options = {new: true};

      Organization.findOneAndUpdate(query, update, options).exec()
      .then(updatedOrganization => {
        var updatedOrgDto = {
          uuid: updatedOrganization.uuid,
          lastModified: updatedOrganization.lastModified,
          status: updatedOrganization.status,
          name: updatedOrganization.name,
          description: updatedOrganization.description,
          address: updatedOrganization.address,
          email: updatedOrganization.email,
          phone: updatedOrganization.phone,
          logo: {
            fileName: updatedOrganization.logo.fileName,
            type: updatedOrganization.logo.type,
            uri: updatedOrganization.logo.uri
          },
        };

        resolve(updatedOrgDto);
      })
      .catch(err => {
        console.log(err);
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};
