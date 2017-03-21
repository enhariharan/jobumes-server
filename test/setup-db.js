/*
 * This script is intended to be used by testers or for demo purposes.
 * This script sets up a sample database.
 */
const mongoose = require('mongoose');
const app = require('express')();
const Utils = require('../lib//models/utilities');
const Config = require('../configuration').configuration;
const Role = require('../lib/models/role-model').Role;
const Profile = require('../lib/models/profile-model').Profile;
const Feedback = require('../lib/models/employeefeedback-model').Feedback;
const SocialProfile = require('../lib/models/socialprofile-model').SocialProfile;
const Resume = require('../lib/models/resume-model').Resume;

const opts = { server: { socketOptions: { keepAlive: 1 } } };

var roleAdmin = new Role({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  name: 'admin'
});
var roleRecruiter = new Role({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  name: 'recruiter',
});
var roleJobSeeker = new Role({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  name: 'jobseeker',
});
var roles = [
  roleRecruiter.save(),
  roleAdmin.save(),
  roleJobSeeker.save(),
];

var profileAdmin = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleAdmin.uuid,
  login: { username: 'surya@snigdha.co.in', password: 'password', },
  firstName: 'Surya',
  lastName: 'Vempati',
  gender: 'male',
  email: 'surya@snigdha.co.in',
  phoneNumber: '+911234567890',
});

var profileBidrohaKumarParija = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'bidroha@gmail.com', password: 'password', },
  firstName: 'Bidroha',
  lastName: 'Parija',
  middleName: 'Kumar',
  gender: 'male',
  email: 'bidroha@gmail.com',
  phoneNumber: '+911234567890',
});

var profileChandrapriyaValluri = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'chandrapriya302@gmail.com', password: 'password', },
  firstName: 'Chandrapriya',
  lastName: 'Valluri',
  gender: 'female',
  email: 'chandrapriya302@gmail.com',
  phoneNumber: '+911234567890',
});

var profileChinnaKutumbaRaoDadi = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'chinnatherron@gmail.com', password: 'password', },
  firstName: 'Chinna',
  lastName: 'Dadi',
  middleName: 'Kutumba Rao',
  gender: 'male',
  email: 'chandrapriya302@gmail.com',
  phoneNumber: '+911234567890',
});

var profileSatyanarayanaReddyK = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'satyakng.194@gmail.com', password: 'password', },
  firstName: 'Satyanarayana',
  lastName: 'Reddy',
  middleName: 'K',
  gender: 'male',
  email: 'satyakng.194@gmail.com',
  phoneNumber: '+911234567890',
});

var profileLakshmiPriyankaGorantla = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'priya.gorntla@gmail.com', password: 'password', },
  firstName: 'Lakshmi',
  lastName: 'Gorantla',
  middleName: 'Priyanka',
  gender: 'female',
  email: 'priya.gorntla@gmail.com',
  phoneNumber: '+911234567890',
});

var profileRamyaReddyB = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'ramyapinky09@gmail.com', password: 'password', },
  firstName: 'Ramya',
  lastName: 'Reddy',
  middleName: 'B',
  gender: 'female',
  email: 'ramyapinky09@gmail.com',
  phoneNumber: '+911234567890',
});

var profileSruthiNallamothu = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'n.sruthi1995@gmail.com', password: 'password', },
  firstName: 'Sruthi',
  lastName: 'Nallamothu',
  middleName: '',
  gender: 'female',
  email: 'n.sruthi1995@gmail.com',
  phoneNumber: '+911234567890',
});

var profileSudeepKiran = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'kiransudeep@gmail.com', password: 'password', },
  firstName: 'Sudeep',
  lastName: 'Kiran',
  gender: 'male',
  email: 'kiransudeep@gmail.com',
  phoneNumber: '+911234567890',
});

var profileVijayaSyamKumarDamaraju = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'vijaydsk@outlook.com', password: 'password', },
  firstName: 'Vijaya',
  lastName: 'Damaraju',
  middleName: 'Syam Kumar',
  gender: 'male',
  email: 'vijaydsk@outlook.com',
  phoneNumber: '+911234567890',
});

var profileVinodKumarRayana = new Profile({
  uuid: Utils.getUuid(),
  created: { timestamp: Utils.getTimestamp(), by: this.uuid, },
  lastModified: [{ timestamp: Utils.getTimestamp(), by: this.uuid, },],
  status: 'registered',
  role: roleJobSeeker.uuid,
  login: { username: 'vinodkumar.rayana567@gmail.com', password: 'password', },
  firstName: 'Vinod Kumar',
  lastName: 'Rayana',
  gender: 'male',
  email: 'vinodkumar.rayana567@gmail.com',
  phoneNumber: '+911234567890',
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

const parsedResumeBidrohaKumarParija = require('./resume-bidroha-kumar-parija');
const parsedResumeChandrapriyaValluri = require('./resume-chandrapriya-valluri');
const parsedResumeChinnaKutumbaRaoDadi = require('./resume-chinna-kutumbarao-dadi');
const parsedResumeLakshmiPriyankaGorantla = require('./resume-lakshmi-priyanka-gorantla');
const parsedResumeRamyaReddyB = require('./resume-ramya-reddy-b');
const parsedResumeSatyanarayanaReddyK = require('./resume-satyanarayana-reddy-k');
const parsedResumeSruthiNallamothu = require('./resume-sruthi-nallamothu');
const parsedResumeSudeepKiran = require('./resume-sudeep-kiran');
const parsedResumeVijayaSyamKumarDamaraju = require('./resume-vijaya-syam-kumar-damaraju');
const parsedResumeVinodKumarRayana = require('./resume-vinod-kumar-rayana');

var resumeBidrohaKumarParija = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Bidroha Kumar Parija Resume 1',
  status: 'active',
  parsedJson: parsedResumeBidrohaKumarParija,
  profile: profileBidrohaKumarParija.uuid,
});

var resumeChandrapriyaValluri = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Chandrapriya Valluri Resume 1',
  status: 'active',
  parsedJson: require('./resume-chandrapriya-valluri'),
  profile: profileChandrapriyaValluri.uuid,
});

var resumeChinnaKutumbaRaoDadi = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Chinna Kutumba Rao Dadi Resume 1',
  status: 'active',
  parsedJson: parsedResumeChinnaKutumbaRaoDadi,
  profile: profileChinnaKutumbaRaoDadi.uuid,
});

var resumeLakshmiPriyankaGorantla = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Lakshmi Priyanka Gorantla Resume 1',
  status: 'active',
  parsedJson: parsedResumeLakshmiPriyankaGorantla,
  profile: profileLakshmiPriyankaGorantla.uuid,
});

var resumeRamyaReddyB = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Ramya Reddy B Resume 1',
  status: 'active',
  parsedJson: parsedResumeRamyaReddyB,
  profile: profileRamyaReddyB.uuid,
});

var resumeSatyanarayanaReddyK = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Satyanarayana Reddy K Resume 1',
  status: 'active',
  parsedJson: parsedResumeSatyanarayanaReddyK,
  profile: profileSatyanarayanaReddyK.uuid,
});

var resumeSruthiNallamothu = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Sruthi Nallamothu Resume 1',
  status: 'active',
  parsedJson: parsedResumeSruthiNallamothu,
  profile: profileSruthiNallamothu.uuid,
});

var resumeSudeepKiran = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Sudeep Kiran Resume 1',
  status: 'active',
  parsedJson: parsedResumeSudeepKiran,
  profile: profileSudeepKiran.uuid,
});

var resumeVijayaSyamKumarDamaraju = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  url: 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
  name: 'Vijaya Syam Kumar Damaraju Resume 1',
  status: 'active',
  parsedJson: parsedResumeVijayaSyamKumarDamaraju,
  profile: profileVijayaSyamKumarDamaraju.uuid,
});

var resumeVinodKumarRayana = new Resume({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
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
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
  thinkingtocommentfor : 2,
  relationship : 1,
  name : 'Hari N',
  emailid: 'hari.n@email.com',
  subject: 'feedback 1',
  comment: 'This is a example comment',
});

var feedback2 = new Feedback({
  uuid: Utils.getUuid(),
  timestamp: Utils.getTimestamp(),
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
    case 'development': return Config.mongo.development.connectionString;
    case 'test': return Config.mongo.test.connectionString;
    case 'production': return Config.mongo.production.connectionString;
    default: return null;
  }
};

var setupDB = (dbConnection) => {
  return new Promise((resolve, reject) => {
    var conn = null;

    mongoose.connect(getDbConnection());
    Promise.all([
      roles,
      profiles,
      feedbacks,
      resumes
    ])
    .then(messages => {
      messages.forEach(m => {console.info('\nsaved %j', m);});
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
