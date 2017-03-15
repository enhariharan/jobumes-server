var fs = require('fs');
var path = require('path');
var soap = require('soap');
var util = require('util');
var http = require('http');

var Errors = require('../security/errors');
var Configuration = require('../../configuration').configuration;
var Resume = require('../models/resume-model').Resume;
var Profile = require('../models/profile-model').Profile;

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
        // console.info('result: %s', result);
        var json = JSON.parse(result);
        console.info('\nReceived JSON for %s', json.ResumeParserData.ResumeFileName);
        resolve(json);
      };

      var handleError = (err) => { reject(err); };

      var handlePostResponse = (response) => {
        console.log("response status: %d", response.statusCode);
        console.log("response headers: %j", response.headers);
        console.log('Receiving POST result');
        response.on('data', handleDataReceived);
        response.on('end', handleDataReceiveFinished);
      };

      var postRequest = http.request(postOptions, handlePostResponse);
      postRequest.write(requestData);
      postRequest.end();
      postRequest.on('error', handleError);
  });
};

exports.addResume = (resumeDto) => {
  return new Promise(
    (resolve, reject) => {
      var resumeDtoToSave = null;
      _validate(resumeDto)
      .then(validResumeDto => {
        resumeDtoToSave = validResumeDto;
        return _parseResumeRest(resumeDtoToSave.url);
      })
      .then((parsedResumeJson) => {
        if (/error/.test(parsedResumeJson) === true) throw(parsedResumeJson);

        resumeDtoToSave.parsedJson = parsedResumeJson;
        var resumeObj = new Resume(resumeDtoToSave);
        return resumeObj.save();
      })
      .then((savedResume) => { resolve(savedResume); })
      .catch((err) => {
        if (err.code === undefined) reject({code: '500', reason: err.toString()});
        reject(err);
      });
  });
};

exports.getResumesByProfile = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
      Resume.find({profile: profileUuid}).exec()
      .then(resumes => { resolve(resumes); })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err.toString()});
        reject(err);
      });
  });
};
