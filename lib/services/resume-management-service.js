const fs = require('fs');
const path = require('path');
const soap = require('soap');
const util = require('util');
const http = require('http');

const Errors = require('../security/errors');
const Configuration = require('../../configuration').configuration;
const Resume = require('../models/resume-model').Resume;
const Profile = require('../models/profile-model').Profile;

var _validate = (resumeDto) => {
  return new Promise(
    (resolve, reject) => {
      if (!resumeDto.url || resumeDto.url === undefined)
        reject(Errors.resumeUrlCannotBeEmpty);
      if (!resumeDto.profile || resumeDto.profile === undefined)
        reject(Errors.resumeProfileCannotBeEmpty);
      if (!resumeDto.name || resumeDto.name === undefined)
        resumeDto.name = "new name"; // put file name from url here
      if (!resumeDto.status || resumeDto.status === undefined)
        resumeDto.name = "active"; // put file name from url here

      resolve(resumeDto);
  });
};

var _parseResumeRest = (resumeUrl) => {
  return new Promise(
    (resolve, reject) => {
      var requestData = JSON.stringify({
        'url': 'http://183.82.1.143:9058/jobumes/resumes/Arun.docx',
        'userkey':'YOABEO3303Q',
        'version':'7.0.0',
        'subuserid':'redgummi'});

      var requestHeaders = {
          'Content-Type' : 'application/json',
          'Content-Length' : Buffer.byteLength(requestData, 'utf8')
      };

      var postOptions = {
          host : 'redgummi1.rchilli.com',
          port : 80,
          path : '/RChilliParser/Rchilli/parseResume',
          method : 'POST',
          headers : requestHeaders
      };

      var result = null;
      var handleDataReceived = (data) => {
        process.stdout.write('.');
        if (!result) result = data;
        else result = result + data;
      };

      var handleDataReceiveFinished = () => {
        var json = JSON.parse(result);
        resolve(json);
      };

      var handleError = (err) => { reject(err); };

      var handlePostResponse = (response) => {
        response.on('data', handleDataReceived);
        response.on('end', handleDataReceiveFinished);
      };

      var postRequest = http.request(postOptions, handlePostResponse);
      postRequest.write(requestData);
      postRequest.end();
      postRequest.on('error', handleError);
  });
};

var _parseResumeFileContents = (metadata) => {
  return new Promise(
    (resolve, reject) => {
       var data = fs.readFileSync(metadata.path);
       var contents = new Buffer(data).toString('base64');
       resolve(contents);
  });
};

exports.getResumesByProfile = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
      Resume.find({profile: profileUuid, status: 'active'}).exec()
      .then(resumes => {
        var resumesDto = {
          profile: profileUuid,
          resumes: resumes.map(resume => {
            var r = {
              uuid: resume.uuid,
              timestamp: resume.timestamp,
              name: resume.name,
              details: resume.parsedJson,
            };
            return r;
          }),
        };
        resolve(resumesDto);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err.toString()});
        reject(err);
      });
  });
};

exports.addResume = (resumeDto, resumeFileMetadata) => {
  return new Promise(
    (resolve, reject) => {
      var resumeDtoToSave = resumeDto;
      _parseResumeFileContents(resumeFileMetadata)
      .then(resumeFileData => {
        resumeDtoToSave.file = resumeFileData;
        console.log('Parsing resume into JSON');
        return _parseResumeRest(resumeDtoToSave, resumeFileMetadata);
      })
      .then(parsedResumeJson => {
        resumeDtoToSave.parsedJson = parsedResumeJson;
        var resumeObj = new Resume(resumeDtoToSave);
        return resumeObj.save();
      })
      .then(savedResume => {
        console.info('\nsavedResume: %s', JSON.stringify(savedResume.name));
        resolve(savedResume);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err.toString()});
        reject(err);
      });

      return resumeDto;
  });
};
