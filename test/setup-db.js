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
var Resume = require('../lib/models/resume-model').Resume;

var parsedResumeBidrohaKumarParija = require('./resume-bidroha-kumar-parija');
var parsedResumeChandrapriyaValluri = require('./resume-chandrapriya-valluri');
var parsedResumeChinnaKutumbaRaoDadi = require('./resume-chinna-kutumbarao-dadi');
var parsedResumeLakshmiPriyankaGorantla = require('./resume-lakshmi-priyanka-gorantla');
var parsedResumeRamyaReddyB = require('./resume-ramya-reddy-b');
var parsedResumeSatyanarayanaReddyK = require('./resume-satyanarayana-reddy-k');
var parsedResumeSruthiNallamothu = require('./resume-sruthi-nallamothu');
var parsedResumeSudeepKiran = require('./resume-sudeep-kiran');
var parsedResumeVijayaSyamKumarDamaraju = require('./resume-vijaya-syam-kumar-damaraju');
var parsedResumeVinodKumarRayana = require('./resume-vinod-kumar-rayana');

var opts = { server: { socketOptions: { keepAlive: 1 } } };

var roleAdmin = new Role({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  name: 'admin'
});
var roleRecruiter = new Role({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  name: 'recruiter',
});
var roleJobSeeker = new Role({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  name: 'jobseeker',
});
var roles = [
  roleRecruiter.save(),
  roleAdmin.save(),
  roleJobSeeker.save(),
];

var userAdmin = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'surya@snigdha.co.in',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleAdmin.uuid
});
var userBidrohaKumarParija = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'bidroha@gmail.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var userChandrapriyaValluri = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'chandrapriya302@gmail.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var userChinnaKutumbaRaoDadi = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'chinnatherron@gmail.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var userSatyanarayanaReddyK = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'satyakng.194@gmail.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var userLakshmiPriyankaGorantla = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'priya.gorntla@gmail.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var userRamyaReddyB = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'ramyapinky09@gmail.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var userSruthiNallamothu = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'n.sruthi1995@gmail.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var userSudeepKiran = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'kiransudeep@gmail.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var userVijayaSyamKumarDamaraju = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'vijaydsk@outlook.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var userVinodKumarRayana = new User({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  username: 'vinodkumar.rayana567@gmail.com',
  password: 'password',
  phonenumber: '+911234567890',
  status: 'activated',
  role: roleJobSeeker.uuid
});
var users = [
  userAdmin.save(),
  userBidrohaKumarParija.save(),
  userChandrapriyaValluri.save(),
  userChinnaKutumbaRaoDadi.save(),
  userSatyanarayanaReddyK.save(),
  userLakshmiPriyankaGorantla.save(),
  userRamyaReddyB.save(),
  userSruthiNallamothu.save(),
  userSudeepKiran.save(),
  userVijayaSyamKumarDamaraju.save(),
  userVinodKumarRayana.save(),
];

var profileAdmin = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Surya',
  lastName: 'Vempati',
  middleName: '',
  gender: 'male',
  profilePicPath: '',
  user: userAdmin.uuid,
});
var profileBidrohaKumarParija = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Bidroha',
  lastName: 'Parija',
  middleName: 'Kumar',
  gender: 'male',
  profilePicPath: '',
  user: userBidrohaKumarParija.uuid,
});
var profileChandrapriyaValluri = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Chandrapriya',
  lastName: 'Valluri',
  middleName: '',
  gender: 'female',
  profilePicPath: '',
  user: userChandrapriyaValluri.uuid,
});
var profileChinnaKutumbaRaoDadi = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Chinna',
  lastName: 'Dadi',
  middleName: 'Kutumba Rao',
  gender: 'male',
  profilePicPath: '',
  user: userChinnaKutumbaRaoDadi.uuid,
});
var profileSatyanarayanaReddyK = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Satyanarayana',
  lastName: 'Reddy',
  middleName: 'K',
  gender: 'male',
  profilePicPath: '',
  user: userSatyanarayanaReddyK.uuid,
});
var profileLakshmiPriyankaGorantla = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Lakshmi',
  lastName: 'Gorantla',
  middleName: 'Priyanka',
  gender: 'female',
  profilePicPath: '',
  user: userLakshmiPriyankaGorantla.uuid,
});
var profileRamyaReddyB = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Ramya',
  lastName: 'Reddy',
  middleName: 'B',
  gender: 'female',
  profilePicPath: '',
  user: userRamyaReddyB.uuid,
});
var profileSruthiNallamothu = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Sruthi',
  lastName: 'Nallamothu',
  middleName: '',
  gender: 'female',
  profilePicPath: '',
  user: userSruthiNallamothu.uuid,
});
var profileSudeepKiran = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Sudeep',
  lastName: 'Kiran',
  middleName: '',
  gender: 'male',
  profilePicPath: '',
  user: userSudeepKiran.uuid,
});
var profileVijayaSyamKumarDamaraju = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Vijaya',
  lastName: 'Damaraju',
  middleName: 'Syam Kumar',
  gender: 'male',
  profilePicPath: '',
  user: userVijayaSyamKumarDamaraju.uuid,
});
var profileVinodKumarRayana = new Profile({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  firstName: 'Vinod Kumar',
  lastName: 'Rayana',
  middleName: '',
  gender: 'male',
  profilePicPath: '',
  user: userVinodKumarRayana.uuid,
});
var profiles = [
  profileAdmin.save(),
  profileBidrohaKumarParija.save(),
  profileChandrapriyaValluri.save(),
  profileChinnaKutumbaRaoDadi.save(),
  profileSatyanarayanaReddyK.save(),
  profileLakshmiPriyankaGorantla.save(),
  profileRamyaReddyB.save(),
  profileSruthiNallamothu.save(),
  profileSudeepKiran.save(),
  profileVijayaSyamKumarDamaraju.save(),
  profileVinodKumarRayana.save(),
];

var resumeBidrohaKumarParija = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Bidroha Kumar Parija Resume 1',
  status: 'active',
  parsedJson: parsedResumeBidrohaKumarParija,
  profile: profileBidrohaKumarParija.uuid,
});
var resumeChandrapriyaValluri = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Chandrapriya Valluri Resume 1',
  status: 'active',
  parsedJson: require('./resume-chandrapriya-valluri'),
  profile: profileChandrapriyaValluri.uuid,
});
var resumeChinnaKutumbaRaoDadi = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Chinna Kutumba Rao Dadi Resume 1',
  status: 'active',
  parsedJson: parsedResumeChinnaKutumbaRaoDadi,
  profile: profileChinnaKutumbaRaoDadi.uuid,
});
var resumeLakshmiPriyankaGorantla = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Lakshmi Priyanka Gorantla Resume 1',
  status: 'active',
  parsedJson: parsedResumeLakshmiPriyankaGorantla,
  profile: profileLakshmiPriyankaGorantla.uuid,
});
var resumeRamyaReddyB = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Ramya Reddy B Resume 1',
  status: 'active',
  parsedJson: parsedResumeRamyaReddyB,
  profile: profileRamyaReddyB.uuid,
});
var resumeSatyanarayanaReddyK = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Satyanarayana Reddy K Resume 1',
  status: 'active',
  parsedJson: parsedResumeSatyanarayanaReddyK,
  profile: profileSatyanarayanaReddyK.uuid,
});
var resumeSruthiNallamothu = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Sruthi Nallamothu Resume 1',
  status: 'active',
  parsedJson: parsedResumeSruthiNallamothu,
  profile: profileSruthiNallamothu.uuid,
});
var resumeSudeepKiran = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Sudeep Kiran Resume 1',
  status: 'active',
  parsedJson: parsedResumeSudeepKiran,
  profile: profileSudeepKiran.uuid,
});
var resumeVijayaSyamKumarDamaraju = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Vijaya Syam Kumar Damaraju Resume 1',
  status: 'active',
  parsedJson: parsedResumeVijayaSyamKumarDamaraju,
  profile: profileVijayaSyamKumarDamaraju.uuid,
});
var resumeVinodKumarRayana = new Resume({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Vinod Kumar Rayana Resume 1',
  status: 'active',
  parsedJson: parsedResumeVinodKumarRayana,
  profile: profileVinodKumarRayana.uuid,
});
var resumes = [
  resumeBidrohaKumarParija.save(),
  resumeChandrapriyaValluri.save(),
  resumeChinnaKutumbaRaoDadi.save(),
  resumeLakshmiPriyankaGorantla.save(),
  resumeRamyaReddyB.save(),
  resumeSatyanarayanaReddyK.save(),
  resumeSruthiNallamothu.save(),
  resumeSudeepKiran.save(),
  resumeVijayaSyamKumarDamaraju.save(),
  resumeVinodKumarRayana.save(),
];

var feedback1 = new Feedback({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  thinkingtocommentfor : 2,
  relationship : 1,
  name : 'Hari N',
  emailid: 'hari.n@email.com',
  subject: 'feedback 1',
  comment: 'This is a example comment',
});
var feedback2 = new Feedback({
  uuid: utilities.getUuid(),
  timestamp: utilities.getTimestamp(),
  thinkingtocommentfor : 1,
  relationship : 2,
  name : 'Mahendar B',
  emailid: 'mahi.b@email.com',
  subject: 'feedback 2',
  comment: 'This is another example comment',
});
var feedbacks = [
  feedback1.save(),
  feedback2.save(),
];

// return mongodb connection string
var getDbConnection = (env) => {
  if (!env || env === undefined)
    env = app.get('env');

  switch(env) {
    case 'development': return configuration.mongo.development.connectionString;
    case 'test': return configuration.mongo.test.connectionString;
    case 'production': return configuration.mongo.production.connectionString;
    default: return null;
  }
};

var setupDB = (dbConnection) => {
  return new Promise((resolve, reject) => {
    var conn = null;

    mongoose.connect(getDbConnection());
    console.log("parsed resume: %j", resumeBidrohaKumarParija.parsedJson);
    Promise.all([
      roles,
      users,
      profiles,
      feedbacks,
      resumes
    ])
    .then(messages => {
      console.info('saved objects %j', messages);
      mongoose.disconnect();
      resolve(true);
    })
    .catch(err => {
      mongoose.disconnect();
      reject(err);
    });
  });
};

if (require.main === module) {
  setupDB()
  .then(result => { console.info('result: ' + result); })
  .catch(err => { console.error('err: ' + err); });
}
else module.exports = {setupDB};
