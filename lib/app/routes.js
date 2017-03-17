var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();
var login = require('../controllers/login-controller');
var roles = require('../controllers/roles-controller');
var profiles = require('../controllers/profiles-controller');
var users = require('../controllers/users-controller');
var employeejobs = require('../controllers/employeejobs-controller');
var resumes = require('../controllers/resumes-controller');
var jobs = require('../controllers/jobs-controller');
var signup = require('../controllers/signup-controller');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

module.exports = function(app) {
  "use strict";

  app.use(jsonParser);

  app.get('/feedbacks', employeejobs.getAllFeedbacks);
  app.post('/feedbacks', jsonParser, employeejobs.addFeedback);

  app.get('/roles', roles.getAllRoles);
  app.post('/roles', jsonParser, roles.addRole);

  app.get('/profiles', profiles.getAllProfiles);
  app.post('/profiles', jsonParser, profiles.addProfile);

  app.get('/resumes', resumes.getAllResumes);
  app.post('/resumes', jsonParser, resumes.addResume);

  // app.get('/jobs', jobs.getAlljobs);
  app.post('/jobs', upload.single('file'), jobs.addJob);

  app.get('/users/:uuid', users.getUserByUuid);
  app.post('/users', jsonParser, users.addUser);
  app.post('/signup', jsonParser, signup.addNewUser);

  app.get('/login', login.login);
};
