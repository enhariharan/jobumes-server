/*
 * This script is intended to be used by testers or for demo purposes.
 * This script sets up a sample database.
 */
var mongoose = require('mongoose');
var app = require('express')();
var utilities = require('../lib//models/utilities');
var configuration = require('../configuration').configuration;
var Role = require('../lib/models/role-model').Role;
var User = require('../lib/models/user-model').User;
var Profile = require('../lib/models/profile-model').Profile;
var Feedback = require('../lib/models/employeefeedback-model').Feedback;

var opts = { server: { socketOptions: { keepAlive: 1 } } };

var roleAdmin = new Role({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  name: 'admin'});
var roleRecruiter = new Role(
  {uuid: utilities.getUuid(),
   timestamp: utilities.getTimestamp(),
   name: 'recruiter'});
var roleJobSeeker = new Role(
  {uuid: utilities.getUuid(),
   timestamp: utilities.getTimestamp(),
   name: 'jobseeker'});
var roles = [roleRecruiter, roleAdmin, roleJobSeeker];

var profileSurya = new Profile(
  {uuid: utilities.getUuid(),
   timestamp: utilities.getTimestamp(),
   firstName: 'Surya',
   lastName: 'Vempati',
   middleName: '',
   gender: 'male',
   profilePicPath: '',
   role: roleAdmin.uuid,
   email: 'surya@snigdha.co.in'});
var profileHari = new Profile(
  {uuid: utilities.getUuid(),
   timestamp: utilities.getTimestamp(),
   firstName: 'Hari',
   lastName: 'N',
   middleName: '',
   gender: 'male',
   profilePicPath: '',
   role: roleJobSeeker.uuid,
   email: 'hari@gmail.com'});
var profileReema = new Profile(
  {uuid: utilities.getUuid(),
   timestamp: utilities.getTimestamp(),
   firstName: 'Reema',
   lastName: 'Chaterjee',
   middleName: '',
   gender: 'female',
   profilePicPath: '',
   role: roleRecruiter.uuid,
   email: 'reema@greatrecruiters.com'});
var profiles = [profileSurya, profileHari, profileReema];

var userSurya = new User(
  {uuid: utilities.getUuid(),
   timestamp: utilities.getTimestamp(),
   username: 'surya@snigdha.co.in',
   password: 'password',
   status: 'activated',
   profile: profileSurya.uuid,
   role: roleAdmin.uuid});
var userHari = new User(
  {uuid: utilities.getUuid(),
   timestamp: utilities.getTimestamp(),
   username: 'userClient2Corp1',
   password: 'password',
   status: 'activated',
   profile: profileHari.uuid,
   role: roleJobSeeker.uuid});
var userReema = new User(
  {uuid: utilities.getUuid(),
   timestamp: utilities.getTimestamp(),
   username: 'reema@greatrecruiters.com',
   password: 'password',
   status: 'activated',
   profile: profileReema.uuid,
   role: roleRecruiter.uuid});
var users = [userSurya, userHari, userHari];

var setupRoles = function() {
    roles.forEach(r => { r.save(err => { if (err) reject('error while saving roles.'); }); });
};

var setupProfiles = function() {
    profiles.forEach(c => { c.save(err => { if (err) reject('error while saving clients.'); }); });
};

var setupUsers = function() {
    users.forEach(u => { u.save(err => { if (err) reject('error while saving users.'); }); });
};

// return mongodb connection string
var getDbConnection = (env) => {
  switch(env) {
    case 'development': return configuration.mongo.development.connectionString;
    case 'test': return configuration.mongo.test.connectionString;
    case 'production': return configuration.mongo.production.connectionString;
    default: return null;
  }
};

var promises = [];
var setupPromises = () => {
  roles.forEach(r => { promises.push(r.save()); });
  users.forEach(u => { promises.push(u.save()); });
  profiles.forEach(p => { promises.push(p.save()); });
  console.log('returning promises: ' + JSON.stringify(promises));
  return promises;
};

var setupDB = (dbConnection) => {
  return new Promise((resolve, reject) => {
    var conn = null;
    if (!dbConnection || dbConnection === undefined) conn = mongoose.createConnection(getDbConnection(app.get('env')), opts);
    else conn = dbConnection;
    console.log('dbConnection readyState: ' + conn.readyState);
    conn.on('connecting', () => {console.log('\nconnecting');});
    conn.on('connected', () => {
      console.log('\nconnected');
    });
    conn.on('open', () => {
      console.log('\nopened');
      setupRoles();
    });
    conn.on('disconnecting', () => {console.log('\ndisconnecting');});
    conn.on('disconnected', () => {console.log('\ndisconnected');});
    conn.on('close', () => {console.log('\nclosed');});
    conn.on('reconnected', () => {console.log('\nreconnected');});
    conn.on('error', (err) => {console.log('\nError raised: ' + err + err.stack);});
  });
};

if (require.main === module) setupDB();
else module.exports = {setupDB};
