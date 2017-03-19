const bodyparser = require('body-parser');
const jsonParser = bodyparser.json();
const login = require('../controllers/login-controller');
const roles = require('../controllers/roles-controller');
const profiles = require('../controllers/profiles-controller');
const users = require('../controllers/users-controller');
const employeejobs = require('../controllers/employeejobs-controller');
const resumes = require('../controllers/resumes-controller');
const jobs = require('../controllers/jobs-controller');
const signup = require('../controllers/signup-controller');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

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
  app.post('/resumes', upload.single('file'), resumes.addResume);

  // app.get('/jobs', jobs.getAlljobs);
  app.post('/jobs', upload.single('file'), jobs.addJob);

  app.get('/users/:uuid', users.getUserByUuid);
  app.post('/users', jsonParser, users.addUser);
  app.post('/signup', jsonParser, signup.addNewUser);

  app.get('/login', login.login);
};
