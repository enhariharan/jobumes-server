const validator = require('../security/validator');
const Errors = require('../security/errors');
const utilities = require('../models/utilities');
const profileManagementService = require('../services/profile-management-service');
const orgManagementService = require('../services/organization-management-service');

exports.addNewOrganization = (req, res) => {
  "use strict";

  if (utilities.isEmptyObj(req.body)) { return res.status(400).send(Errors.emptyRequestBody).end(); }

  validator.isUserAdmin(req)
  .then(() => { return profileManagementService.getProfileByAuthCredentials(req); })
  .then(profile => {
    var org = {};
    org.uuid = utilities.getUuid();
    org.created = {};
    org.created.timestamp = utilities.getTimestamp();
    org.created.by = profile.uuid;
    org.name = req.body.name;
    org.logo = req.body.logo;
    org.status = req.body.status;
    org.description = req.body.description;
    org.address = {};
    org.address.line1 = req.body.address.line1;
    org.address.line2 = req.body.address.line2;
    org.address.city = req.body.address.city;
    org.address.state = req.body.address.state;
    org.address.country = req.body.address.country;
    org.address.zip = req.body.address.zip;
    org.address.googleMapsUri = req.body.address.googleMapsUri;
    org.internet = [];
    req.body.internet.forEach(a => { org.internet.push(a); });
    org.email = [];
    req.body.email.forEach(e => { org.email.push(e); });
    org.phone = [];
    req.body.phone.forEach(p => { org.phone.push(p); });
    org.socialProfile = [];
    req.body.socialProfile.forEach(sp => { org.socialProfile.push(sp); });

    return orgManagementService.addNewOrganization(org);
  })
  .then(savedOrg => {
    console.info('saved organization ', savedOrg.name);
    return res.status(201).send(savedOrg).end();
  })
  .catch(err => {
    console.info('err: %j', err);
    return res.status(err.code).send(err).end();
  });
};

exports.getAllOrganizations = (req, res) => {
  "use strict";

  validator.isValidCredentials(req)
  .then(() => { return orgManagementService.getAllOrganizations(); })
  .then(orgs => {
    console.info('orgs: %j ', orgs);
    return res.status(200).send(orgs).end();
  })
  .catch(err => {
    console.info('err: %j', err);
    return res.status(err.code).send(err).end();
  });
};

exports.updateLogo = (req, res) => {
  "use strict";
  console.log('req :: %j',req.headers);
  validator.isValidCredentials(req)
  .then(result => { return profileManagementService.getProfileByAuthCredentials(req); })
  .then(profile => {return orgManagementService.updateLogo(profile,req.headers.orguuid, req.file); })
  .then(updatedLogo => { return res.status(200).send(updatedLogo); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
