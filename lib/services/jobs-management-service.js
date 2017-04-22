var fs = require('fs');
var soap = require('soap');
var Organization = require('../models/organization-model').Organization;
var Job = require('../models/job-model').Job;
var JobProfile = require('../models/job-profile-model').JobProfile;
var ProfileManagementService = require('../services/profile-management-service');
var Profile = require('../models/profile-model').Profile;

const Configuration = require('../../configuration').configuration;
const xml2js = require('xml2js');

const utilities = require('../models/utilities');
const errors = require('../security/errors');

// NOTE: DO NOT CHANGE THIS BELOW LoC UNLESS YOU KNOW WHAT YOU ARE DOING.
// If the below line is not given then saving the JD JSON into mongodb fails.
// The error happens especially while parsing skills in the JD.
// Without this line skills in JD XML is parsed into JSON like so:
// <Skills>
//   <Skill type=\"required\"><![CDATA[Advance Java]]></Skill>
//   <Skill type=\"required\"><![CDATA[Swing]]></Skill>
// </Skills>
// is converted to
// "Skills":[{
//  "Skill":[
//    { "_":"Advance Java", "$":{"type":"required"} },
//    { "_":"Swing", "$":{"type":"required"} },
// ]}]
// This creates the following error while saving into MongoDB:
// Error: key $ must not start with '$'
// The below LoC fixes this by setting options into the xml2js parser such that
// "_" is replaced by "name"
// and
// "$" is replaced by "type"
// in the generated JSON. So now, with this change
// <Skills>
//   <Skill type=\"required\"><![CDATA[Advance Java]]></Skill>
//   <Skill type=\"required\"><![CDATA[Swing]]></Skill>
// </Skills>
// is converted to
// "Skills":[{
//  "Skill":[
//    { "name":"Advance Java", "type":{"type":"required"} },
//    { "name":"Swing", "type":{"type":"required"} },
// ]}]
// This JSON gets saved into mongodb properly.
// Personally, I am not sure if this is the correct way to do it but it works.
// So please change this only if you are sure your way moves it to something that works and is also correct.
var xml2jsParser = new xml2js.Parser({attrkey: 'type', charkey: 'name'});

var _parseJobSoap = (jobDtoToSave) => {
  return new Promise(
    (resolve, reject) => {
      soap.createClient(Configuration.jdParser.serviceUrl, (err, client) => {
        if (err) {
          console.error('\nerror creating SOA client: ', err);
          reject(err);
        }
        console.info('\ncreated RChilli client for URL: %s', Configuration.jdParser.serviceUrl);
        // console.info('\njobDtoToSave.file: %s', jobDtoToSave.file);
        // console.info('\nclient: %s', util.inspect(client));

          var options = {
            fileData: jobDtoToSave.file,
            fileName: jobDtoToSave.name,
            userKey: Configuration.jdParser.userKey,
            version: Configuration.jdParser.version,
            subUserId: Configuration.jdParser.subUserId
          };
          client.ParseJD(options, (err, res) => {
            if (err) {
              reject(err);
            }

            var xml = res.return;
            if (/error/.test(xml) === true) {
              reject(xml);
            }
            else {
              resolve(xml);
            }
          }, { timeout: Configuration.jdParser.timeout }); // client.parseJob(...
      }); // soap.createClient(Configuration.jobParser.serviceUrl, (err, client) => {...
  }); // return new Promise( (reject, resolve) => { ...
};

//jshint unused:false
var _parseJDFileContents = (metadata) => {
  return new Promise(
    (resolve, reject) => {
       var data = fs.readFileSync(metadata.path);
       var contents = new Buffer(data).toString('base64');
       resolve(contents);
  });
};

var _convertXmlToJson = (xml) => {
  return new Promise(
    (resolve, reject) => {
      xml2jsParser.parseString(xml, (err, json) => {
        if (err && err !== undefined) {
          reject(err);
        }
        else {
          resolve(json);
        }
      });
  });
};

exports.addJob = (jobDto, uploadedJDFileMetadata) => {
  return new Promise(
    (resolve, reject) => {
      var jobDtoToSave = jobDto;
      _parseJDFileContents(uploadedJDFileMetadata)
      .then(jdFileData => {
        jobDtoToSave.file = jdFileData;
        return _parseJobSoap(jobDtoToSave);
      })
      .then(parsedJobXml => {
        if (/error/.test(parsedJobXml) === true) {
          throw(parsedJobXml);
        }
        return _convertXmlToJson(parsedJobXml);
      })
      .then(parsedJobJson => {
        jobDtoToSave.parsedJson = parsedJobJson;
        var jobObj = new Job(jobDtoToSave);
        return jobObj.save();
      })
      .then(savedJob => { resolve(savedJob); })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err.toString()});
        }
        reject(err);
      });
  });
};

var _getProfileDetails = (profileUuid) =>{
  return new Promise(
    (resolve, reject) => {
      Profile.findOne({uuid: profileUuid},{"uuid":1,"created":1,"lastModified":1,"status":1,"role":1,
    "login.username":1,"firstName":1,"middleName":1,"lastName":1,"email":1,"phoneNumber":1,"gender":1,"socialProfiles":1}).exec()
      .then(p => {
        if (!p || p === undefined) { throw(Errors.userProfileCouldNotBeFound); }
        resolve(p);
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
    });
}

var _getApplicantsDetails = (jobUuid) => {
  return new Promise(
    (resolve, reject) => {
      var finalDTO = [];
      JobProfile.find({'job': jobUuid}).exec()
      .then(jobProfiles => {
        // console.log('job profiles count :: %j',jobProfiles);
        var k = 0;
        var n = jobProfiles.length;
        jobProfiles.forEach(jp => {
          k++;

          _getProfileDetails(jp.profile)
          .then(p => {
            var eachJobApplicantDetails = {};
            eachJobApplicantDetails.jobApplicantDetails = p ;
            eachJobApplicantDetails.jobUuid = jobUuid;
            finalDTO.push(eachJobApplicantDetails);
            if(k === n){
              var jobApplicantsCount = {};
              jobApplicantsCount.applicantsCount = n;
              finalDTO.push(jobApplicantsCount);
              resolve(finalDTO);
            }
          })
          .catch(err => {throw err;});
        })
      })
      .catch(err => {
      if (err.code === undefined) { reject({code: '500', reason: err}); }
      reject(err);

  });
});
}
exports._getJobApplicants = (jobs) => {
  "use strict";
  return new Promise(
    (resolve, reject) => {

      var applicantsDTO = [];
      var i = 0;
      var m = jobs.length;
      console.log("jobs length :: "+m);
      jobs.forEach(ja => {
            i++;
        // console.log("j :: %j",ja);
        console.log("call :: "+i);
        _getApplicantsDetails(ja.uuid)
        .then(applicants => {
            console.log('applications :: ',i);
            var applicantsDetails = {};
            applicantsDetails.jobDetails = ja;
            applicantsDetails.jobProfiles = applicants;
            applicantsDTO.push(applicantsDetails);
            console.log('applicant :: %j',applicantsDetails);
            if(i === m){
              resolve(applicantsDTO);
            }
        })
        .catch(err => {throw err;});
      })
  });
};

exports.getJobsByProfile = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
      Job.find({profile: profileUuid},{"uuid":1,"timestamp":1,"name":1,"status":1,"parsedJson":1,"profile":1,"organization":1}).exec()
       .then(jobs => {
         resolve(jobs);
      })
      .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};


exports.getAllJobs = () => {
  return new Promise(
    (resolve, reject) => {
      Job.find().exec()
       .then(jobs => { resolve(jobs); })
       .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};

exports.getApplicantsByJob = (jobUuid) => {
  return new Promise(
    (resolve, reject) => {
      JobProfile.findOne({job:jobUuid}).exec()
       .then(jobApplicationDetails => { resolve(jobApplicationDetails.applicants); })
       .catch(err => {
         if (err.code === undefined) { reject({code: '500', reason: err}); }
         reject(err);
       });
  });
};
exports.getJobsByProfileAndJobUuid = (profileUuid, jobUuid) => {
  return new Promise(
    (resolve, reject) => {
      JobProfile.find({profile: profileUuid, job:jobUuid}).exec()
       .then(jobs => {
         console.log('jobs: %j', jobs);
         resolve(jobs); })
       .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};

exports.getJobDetailsByUuid = (jobUuid) => {
  return new Promise(
    (resolve, reject) => {
      Job.findOne({uuid: jobUuid},{"uuid":1,"name":1,"status":1,"parsedJson":1}).exec()
       .then(job => { resolve(job); })
       .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};

// the below function checks if the provided status string is valid.
// status is considered valid if it is one of (active|inactive|hold|closed)
// if status is sent empty then "false" is returned
// if status is not empty and valid then "true" is returned
// if status is not empty and invalid then an error code is returned
function _isJobStatusPresentAndValid(status) {
  return new Promise(
    (resolve, reject) => {
      if (status === null || status === undefined) { resolve(false); }

      var statusFound = false;
      ["active", "inactive", "hold", "closed"].forEach(s => {
        if (s === status) {
          statusFound = true;
          resolve(true);
        }
      });
      if (!statusFound) { reject(errors.incorrectJobStatus); }
  });
}

// the below function checks if the provided organization uuid is valid.
// And organiation is considered valid if it is present in the "organizations" collection
// if org is sent empty then "false" is returned
// if org is not empty and is a valid uuid then "true" is returned
// if org is not empty and is an invalid uuid then an error code is returned
function _isOrganizationPresentAndValid(org) {
  return new Promise(
    (resolve, reject) => {
      if (utilities.isEmptyObj(org) === true) { resolve(false); }

      Organization.findOne({uuid: org}).exec()
      .then(foundOrg => {
        if (utilities.isEmptyObj(foundOrg) === false) { resolve(true); }
        else { throw(errors.orgNotFound); }
      })
      .catch(err => { reject(err); });
  });
}

exports.updateJob = (job) => {
  return new Promise(
    (resolve, reject) => {

      var fieldsToUpdate = {};
      var jobToUpdate = null;

      Job.findOne({uuid: job.uuid}).exec() // First, ensure that job is valid
      .then(foundJob => {
        if (utilities.isEmptyObj(foundJob)) { throw(errors.jobNotFound); }
        jobToUpdate = foundJob;
        return _isOrganizationPresentAndValid(job.organization);
      })
      .then(isOrganizationPresentAndValid => { // next, ensure that org is valid, if present
        if (isOrganizationPresentAndValid === true) { fieldsToUpdate.organization = job.organization; }
        return _isJobStatusPresentAndValid(job.status);
      })
      .then(isJobStatusPresentAndValid => { // next, ensure that job status is valid, if present
        if (isJobStatusPresentAndValid === true) { fieldsToUpdate.status = job.status; }
        var lastModified = [];
        if (utilities.isEmptyObj(jobToUpdate.lastModified) === false) { lastModified = jobToUpdate.lastModified; }

        // finally, add updated timestamp
        var latestTimeStamp = {};
        latestTimeStamp.timestamp = utilities.getTimestamp();
        latestTimeStamp.by = job.profile;
        lastModified.push(latestTimeStamp);
        fieldsToUpdate.lastModified = lastModified;

        // and then, update colelction with new details
        const query = {uuid: job.uuid};
        const update = {$set: fieldsToUpdate};
        const options = {new: true};

        return Job.findOneAndUpdate(query, update, options).exec();
      })
      .then(updatedJob => { resolve(updatedJob); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err.toString()}); }
        reject(err);
      });
  });
};
