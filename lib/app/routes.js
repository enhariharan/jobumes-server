const bodyparser = require('body-parser');
const jsonParser = bodyparser.json();
const login = require('../controllers/login-controller');
const roles = require('../controllers/roles-controller');
const videos = require('../controllers/videos-controller');
const industrytype = require('../controllers/industry-type-controller');
const functionalarea = require('../controllers/functional-area-controller');
const profiles = require('../controllers/profiles-controller');
const users = require('../controllers/users-controller');
const feedbacks = require('../controllers/feedbacks-controller');
const resumes = require('../controllers/resumes-controller');
const jobs = require('../controllers/jobs-controller');
const signup = require('../controllers/signup-controller');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, '/tmp/jobumes-uploads'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});

var upload = multer({ storage: storage });

module.exports = function(app) {
  "use strict";

  app.use(jsonParser);

  app.get('/feedbacks', feedbacks.getAllFeedbacks);
  app.post('/feedbacks', jsonParser, feedbacks.addFeedback);

  app.get('/roles', roles.getAllRoles);
  app.post('/roles', jsonParser, roles.addRole);

  app.get('/industryType', industrytype.getAllIndustryTypes);
  app.post('/industryType', jsonParser, industrytype.addIndustryType);

  app.get('/videos', videos.getVideoByProfile);
  app.post('/videos', jsonParser, videos.addVideo);

  app.get('/functionalArea', functionalarea.getAllFunctionalAreas);
  app.post('/functionalArea', jsonParser, functionalarea.addFunctionalArea);

  app.get('/profiles', profiles.getAllProfiles);
  app.post('/profiles', jsonParser, profiles.addProfile);
  app.put('/profiles', jsonParser, profiles.changePassword);

  app.get('/resumes', resumes.getResumesByProfile);
  app.put('/resumes/coverLetters', resumes.addCoverLetterToResume);
  app.post('/resumes', upload.single('file'), resumes.addResume);

  app.get('/jobs', jobs.getAllJobs);
  app.get('/jobs/byRecruiter', jobs.getAllJobsByRecruiter);
  app.get('/jobs/applicants/:jobUuid', jobs.getAllJobApplicants);
  app.post('/jobs', upload.single('file'), jobs.addJob);

  app.get('/users/:uuid', users.getUserByUuid);
  app.post('/users', jsonParser, users.addUser);
  app.post('/signup', jsonParser, signup.addNewUser);

  app.get('/login', login.login);
};
