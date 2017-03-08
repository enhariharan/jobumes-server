var fs = require('fs');
var path = require('path');
var soap = require('soap');
var util = require('util');

var Errors = require('../security/errors');
var Configuration = require('../../configuration').configuration;
var Resumes = require('../models/resume-model').Resume;

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

var _parseResume = (resumeUrl) => {
  return new Promise(
    (reject, resolve) => {

      soap.createClient(Configuration.resumeParser.serviceUrl, function(err, client)
      {
        console.info('created RChilli client at WSDL URL: ' + Configuration.resumeParser.serviceUrl);

        var options = {
          url: resumeUrl,
          userkey: Configuration.resumeParser.userKey,
          version: Configuration.resumeParser.version,
          subUserId: Configuration.resumeParser.subUserId
        }

        console.info('Now parsing resume : ' + options.url);
        client.parseResume(options, function(err, res) {
          if (err) {
            return console.error('error =>', err);
            reject(err)
          }
          var xml = res.return;
          if (xml.search('error') !== -1) reject(xml);
          resolve(xml);
        }, { timeout: 120 * 1000 });
      });
  });
};

exports.addResume = (resumeDto) => {
  return new Promise(
    (resolve, reject) => {
      var resumeDtoToSave = null;
      _validate(resumeDto)
      .then(validResumeDto => {
        resumeDtoToSave = validResumeDto;
        return _parseResume(resumeDtoToSave.url);
      })
      .then(parsedResumeJson => {
        if (parsedResumeJson.search('error') !== -1) throw(parsedResumeJson);

        resumeDtoToSave.parsedJson = parsedResumeJson;
        var resumeObj = new Profile(resumeDtoToSave);
        return resumeObj.save();
      })
      .then(savedResume => {
        console.info('\nsavedResume: %s', JSON.stringify(savedResume));
        resolve(savedResume);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err.toString()});
        reject(err);
      });

      return resumeDto;
  })
}

exports.getResumesByProfile = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
      Resumes.find({profile: profileUuid}).exec()
      .then(resumes => { resolve(resumes); })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err.toString()});
        reject(err);
      });
  });
};
