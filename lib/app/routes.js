const bodyparser = require('body-parser');
const jsonParser = bodyparser.json();
const admin = require('../controllers/admin-controller');
const login = require('../controllers/login-controller');
const roles = require('../controllers/roles-controller');
const videos = require('../controllers/videos-controller');
const industrytype = require('../controllers/industry-type-controller');
const functionalarea = require('../controllers/functional-area-controller');
const profiles = require('../controllers/profiles-controller');
const org = require('../controllers/organizations-controller');
const feedbacks = require('../controllers/feedbacks-controller');
const resumes = require('../controllers/resumes-controller');
const jobs = require('../controllers/jobs-controller');
const signup = require('../controllers/signup-controller');
const Config = require('../../configuration').configuration;
var mkdirp = require('mkdirp');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = (!Config.server.uploadsFolder || Config.server.uploadsFolder === undefined) ?
      ".//tmp//redgummi-uploads" :
      Config.server.uploadsFolder;

    mkdirp(path, (err) => {
      if (err) { console.log('Creating path' + path + 'returned error ' + err); }
      else {
        console.log('uploaded files will be stored in [%s]', path);
        cb(null, path);
      }
    });
  },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});

var upload = multer({ storage: storage });

module.exports = (app) => {
  "use strict";

  app.use(jsonParser);

  app.get('/admin/jobs', admin.getAllJobsPosted);
  app.get('/admin/recruiters', admin.getAllRecruiterProfiles);
  app.get('/admin/jobSeekers', admin.getAllEmployeeProfiles);

  app.get('/feedbacks', feedbacks.getAllFeedbacks);
  app.post('/feedbacks', jsonParser, feedbacks.addFeedback);

  app.get('/roles', roles.getAllRoles);
  app.post('/roles', jsonParser, roles.addRole);

  app.get('/industryTypes', industrytype.getAllIndustryTypes);
  app.post('/industryTypes', jsonParser, industrytype.addIndustryType);

  app.get('/videos', videos.getVideoByProfile);
  app.post('/videos', jsonParser, videos.addVideo);

  app.get('/functionalAreas', functionalarea.getAllFunctionalAreas);
  app.post('/functionalAreas', jsonParser, functionalarea.addFunctionalArea);

  app.post('/profiles', jsonParser, profiles.addProfile);
  app.get('/profiles', profiles.getAllProfiles);
  app.get('/profiles/viewProfile', profiles.getProfileDetails);
  app.put('/profiles', jsonParser, profiles.changePassword);
  app.put('/profiles/editProfile', jsonParser, profiles.editProfile);

  app.get('/profiles/images', profiles.getProfileImage);
  app.put('/profiles/images', jsonParser, profiles.updateProfileImage);

  app.get('/profiles/videos', profiles.getProfileVideo);
  app.put('/profiles/videos', upload.single('file'), profiles.updateProfileVideo);

  app.get('/profiles/jobs', profiles.getSavedJobs);
  app.post('/profiles/jobs', jsonParser, profiles.saveJobs);

  app.post('/resumes', upload.single('file'), resumes.addResume);
  app.get('/resumes', resumes.getResumesByProfile);
  app.get('/resumes/:resumeUuid', resumes.getResumeByUuid);
  app.put('/resumes/coverLetters', resumes.addCoverLetterToResume);
  app.put('/resumes/delete/:resumeUuid', resumes.deleteResume);
  app.post('/resumes/search',jsonParser , resumes.searchResume);


  app.get('/jobs', jobs.getAllJobs);
  app.get('/jobs/byRecruiter', jobs.getAllJobsByRecruiter);
  app.get('/jobs/applicants/:jobUuid', jobs.getAllJobApplicants);
  app.post('/jobs', upload.single('file'), jobs.addJob);
  app.put('/jobs', jsonParser, jobs.updateJob);
 app.post('/jobs/search', jsonParser, jobs.searchJob);

  app.post('/organizations', jsonParser, org.addNewOrganization);
  app.get('/organizations', jsonParser, org.getAllOrganizations);
  app.get('/organizations/profiles', jsonParser, org.getOrganizationsByProfile);
  app.put('/organizations/logos', upload.single('file'), org.updateLogo);
  app.put('/organizations', jsonParser, org.updateOrganizations);

  app.post('/signup', jsonParser, signup.addNewUser);

  app.get('/login', login.login);
};
