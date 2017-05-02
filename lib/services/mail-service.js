var Job = require('../models/job-model').Job;
var Profile = require('../models/profile-model').Profile;
var EmailTemplate = require('../models/email-template-model').EmailTemplate;
var Errors = require('../security/errors');
var ProfileManagementService = require('../services/profile-management-service');
const orgManagementService = require('../services/organization-management-service');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
     user: 'aredgummi@gmail.com',
     pass:'redgummi123'
            // clientId: '163224009781-sl6let00gr7rkh2amiiuo1ov8hd62s6u.apps.googleusercontent.com',
            // clientSecret: 'Tk9na4aNwQW2TnSis1vq6TqE',
            // refreshToken: '1/Ag8OIJyjnLefihl43WGtWiaY-l8f_vkv9RkuJf-DwB4'
    }
});

//jshint unused:false
exports.sendEmail = (mailOptions) => {
  return new Promise(
    (resolve, reject) => {
      var result;
      transporter.sendMail(mailOptions, function (err, res) {
        if(err){
            console.log('Error',err);
            result = "Error in sending Email.";

        } else {
            console.log('Email Sent');
            result = "Email sent Successfully";
        }
        resolve(result);
      });
      // .then(sendResult => {
      //
      // })
      // .catch(err => {
      //   console.error('Err: %s', JSON.stringify(err));
      //   return res.status(err.code).send(err).end();
      // });
  });
};

exports.createMailTemplate = (profileUuid,mail) => {
  return new Promise(
    (resolve, reject) => {

        var created = {};
        created.timestamp = Utils.getTimestamp();
        created.by = profileUuid;
        var lastModified = {};
        lastModified.timestamp = Utils.getTimestamp();
        lastModified.by = profileUuid;

          var templateToSave = new EmailTemplate({
            uuid: Utils.getUuid(),
            created: created,
            lastModified: lastModified,
            status: "active",
            title: mail.title,
            subject: mail.subject,
            text: mail.text,
            profile : profileUuid
          });

          templateToSave.save()
          .then(createdEmail => {
            resolve(createdEmail); })
          .catch(err => {
          if (err.code === undefined) { reject({code: '500', reason: err}); }
            reject(err);
          });
  });
};

exports.listTemplates = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
      EmailTemplate.find()
       .then(templates => { resolve(templates); })
       .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};

exports.editMailTemplate = (modifiedBy,template) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      var lastModified = {};
      lastModified.timestamp = Utilities.getTimestamp();
      lastModified.by = modifiedBy;

      var query = {"uuid": template.uuid};
      var update = {$set:{"lastModified":lastModified,"status":template.status,"title":template.title,"subject":template.subject,"text":template.text}};

      var retrieveData = {"uuid":1,"created":1,"lastModified":1,"status":1,"title":1,"subject":1,"text":1,"profile":1};

      EmailTemplate.findOneAndUpdate(query, update).exec()
      .then(savedTemplate => {
        return EmailTemplate.find(query,retrieveData);
      }).then(modifiedTemplate => {
        resolve(modifiedTemplate);
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};
