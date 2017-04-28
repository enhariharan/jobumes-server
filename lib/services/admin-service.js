var Job = require('../models/job-model').Job;
var Profile = require('../models/profile-model').Profile;
var Errors = require('../security/errors');
var ProfileManagementService = require('../services/profile-management-service');
const orgManagementService = require('../services/organization-management-service');

//jshint unused:false
var _getQuery = (queryParams) => {
  return new Promise(
    (resolve, reject) => {
      if (queryParams.period < 0) {resolve({});}
      else {
        const periodInMs = Number(queryParams.period)*24*60*60*1000;
        const toDate = new Date();
        const fromDate = new Date(toDate - periodInMs);
        const query = {timestamp : {$lte:toDate, $gte:fromDate}};
        resolve(query);
      }
  });
};

//jshint unused:false
var _getEmployerDetails = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
      var employerDTO = [];
      ProfileManagementService.getProfileByUuid2(profileUuid)
      .then(empDetails => {
        // console.log('empDetails :: %j',empDetails.organization);
        // resolve(empDetails);
        if(!empDetails.organization || empDetails.organization === undefined || empDetails.organization === '' || empDetails.organization === "undefined"){
          var employer = {};
          employer.employer = empDetails;
          employer.organizationDetails = "";
          employerDTO.push(employer);
          resolve(employerDTO);
        }else{
          orgManagementService.getOrgDetailsByUuid(empDetails.organization)
          .then(orgDetails => {
            var employer = {};
            employer.employer = empDetails;
            employer.organizationDetails = orgDetails;
            employerDTO.push(employer);
            resolve(employerDTO);
           })
          .catch(err => { reject(err); });
        }
       })
       .catch(err => { reject(err); });
  });
};

var _getMoreInfoForJobsCount = (jobs) => {
  return new Promise(
    (resolve, reject) => {
      var returnJobsDTO = {};
      returnJobsDTO.jobsCount = jobs.length;
      returnJobsDTO.details = [];
      var i = 0;
      jobs.forEach(job => {
        // add  employer details
        // add job details
        _getEmployerDetails(job.profile)
        .then(employerObj => {
          i++;
          var obj = {};
          obj.employerDetails = employerObj;
          obj.jobUuid = job.uuid;
          obj.timestamp = job.timestamp;
          obj.name = job.name;
          obj.status = job.status;
          obj.parsedJson = job.parsedJson;
          returnJobsDTO.details.push(obj);
          if (i === returnJobsDTO.jobsCount) { resolve(returnJobsDTO); }
        })
        .catch(err => { reject(err); });
      });
  });
};

var _getJobsCountDto = (moInfoNeeded, jobs) => {
  return new Promise(
    (resolve, reject) => {
      if (jobs.length === 0) { resolve({jobsCount: 0}); }
      else if (moInfoNeeded === false) { resolve({jobsCount: jobs.length}); }
      else { resolve(_getMoreInfoForJobsCount(jobs)); }
  });
};

exports.getAllJobsPosted = (queryParams) => {
  return new Promise(
    (resolve, reject) => {
      _getQuery(queryParams)
      .then(query => {
        console.info('query: %j', query);
        const fieldsNeeded = {"uuid":1,"timestamp":1,"name":1,"status":1,"parsedJson":1,"profile":1};
        return Job.find(query, fieldsNeeded).exec();
      })
      .then(jobs => {
        console.log('jobs %j',jobs);
        return _getJobsCountDto(queryParams.moreInfo, jobs); })
      .then(dto => {
        console.log('dto:: %j',dto);
        resolve(dto); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

//jshint unused:false
var _getQueryForProfiles = (queryParams,role1,role2) => {
  return new Promise(
    (resolve, reject) => {
      var q = { $or: [ {"role":role1}, { "role": role2 } ] };
      if (queryParams.period < 0) { resolve(q); }
      else {
        const periodInMs = Number(queryParams.period)*24*60*60*1000;
        const toDate = new Date();
        const fromDate = new Date(toDate - periodInMs);
        // const query = { $and : [
        // { "created.timestamp" : {$lte:toDate, $gte:fromDate} },
        // { $or: [{"role":role1},{ "role": role2 } ] }
        // ] };
        const query = {'created.timestamp' : {$lte:toDate, $gte:fromDate},$or: [ {"role":role1}, { "role": role2 } ]};
        resolve(query);
      }
  });
};

//jshint unused:false
var _getQueryForProfilesJS = (queryParams,roleUuid) => {
  return new Promise(
    (resolve, reject) => {
      if (queryParams.period < 0) { resolve({role:roleUuid}); }
      else {
        const periodInMs = Number(queryParams.period)*24*60*60*1000;
        const toDate = new Date();
        const fromDate = new Date(toDate - periodInMs);
        const query = {'created.timestamp' : {$lte:toDate, $gte:fromDate},role:roleUuid};
        resolve(query);
      }
  });
};

//jshint unused:false
var _getMoreInfoForProfilesCount = (profiles) => {
  return new Promise(
    (resolve, reject) => {
      var returnProfilesDTO = {};
      returnProfilesDTO.profilesCount = profiles.length;
      returnProfilesDTO.details = [];
      var i = 0;
      profiles.forEach(profile => {

        if(!profile.organization || profile.organization === undefined || profile.organization === '' || profile.organization === "undefined"){
          i++;
          var obj = {};
          // add  profile details
          obj.profileDetails = profile;
          obj.organizationDetails = "";
          returnProfilesDTO.details.push(obj);
          if (i === returnProfilesDTO.profilesCount) { resolve(returnProfilesDTO); }
        }else{
          orgManagementService.getOrgDetailsByUuid(profile.organization)
          .then(orgDetails => {
            i++;
            var obj = {};
            obj.profileDetails = profile;
            obj.organizationDetails = orgDetails;
            returnProfilesDTO.details.push(obj);
            if (i === returnProfilesDTO.profilesCount) { resolve(returnProfilesDTO); }
          })
          .catch(err => { reject(err); });
        }


      });
  });
};

//jshint unused:false
var _getMoreInfoForJobSeekersCount = (profiles) => {
  return new Promise(
    (resolve, reject) => {
      var returnProfilesDTO = {};
      returnProfilesDTO.profilesCount = profiles.length;
      returnProfilesDTO.details = [];
      var i = 0;
      profiles.forEach(profile => {
        i++;
        var obj = {};
        // add  profile details
        obj.profileDetails = profile;
        returnProfilesDTO.details.push(obj);
        if (i === returnProfilesDTO.profilesCount) { resolve(returnProfilesDTO); }
      });
  });
};

var _getProfilesCountDto = (moInfoNeeded, profiles) => {
  return new Promise(
    (resolve, reject) => {
      if (profiles.length === 0) { resolve({profilesCount: 0}); }
      else if (moInfoNeeded === false) { resolve({profilesCount: profiles.length}); }
      else { resolve(_getMoreInfoForProfilesCount(profiles)); }
  });
};

var _getJobSeekersCountDto = (moInfoNeeded, profiles) => {
  return new Promise(
    (resolve, reject) => {
      if (profiles.length === 0) { resolve({profilesCount: 0}); }
      else if (moInfoNeeded === false) { resolve({profilesCount: profiles.length}); }
      else { resolve(_getMoreInfoForJobSeekersCount(profiles)); }
  });
};

exports.getProfilesByRole = (queryParams,role1,role2) => {
  return new Promise(
    (resolve, reject) => {
    _getQueryForProfiles(queryParams,role1,role2)
    .then(query => {
      console.info('query: %j', query);
      const fieldsNeeded = {"uuid":1,"created":1,"lastModified":1,"status":1,"role":1,
    "login.username":1,"firstName":1,"middleName":1,"lastName":1,"email":1,"phoneNumber":1,"gender":1,"socialProfiles":1,"organization":1};
      return Profile.find(query, fieldsNeeded).exec();
    })
    .then(profiles => {
      console.log('profiles %j',profiles);
      return _getProfilesCountDto(queryParams.moreInfo, profiles); })
    .then(dto => {
      console.log('dto:: %j',dto);
      resolve(dto); })
    .catch(err => {
      if (err.code === undefined) { reject({code: '500', reason: err}); }
      reject(err);
    });
  });
};

exports.getJobSeekersProfiles = (queryParams,roleUuid) => {
  return new Promise(
    (resolve, reject) => {
    _getQueryForProfilesJS(queryParams,roleUuid)
    .then(query => {
      console.info('query: %j', query);
      const fieldsNeeded = {"uuid":1,"created":1,"lastModified":1,"status":1,"role":1,
    "login.username":1,"firstName":1,"middleName":1,"lastName":1,"email":1,"phoneNumber":1,"gender":1,"socialProfiles":1,"organization":1};
      return Profile.find(query, fieldsNeeded).exec();
    })
    .then(profiles => {
      console.log('profiles %j',profiles);
      return _getJobSeekersCountDto(queryParams.moreInfo, profiles); })
    .then(dto => {
      console.log('dto:: %j',dto);
      resolve(dto); })
    .catch(err => {
      if (err.code === undefined) { reject({code: '500', reason: err}); }
      reject(err);
    });
  });
};
