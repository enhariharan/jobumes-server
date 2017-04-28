var Job = require('../models/job-model').Job;
var Profile = require('../models/profile-model').Profile;
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
