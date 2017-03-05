var fs = require('fs');
var path = require('path');
var soap = require('soap');
var util = require('util');

var Errors = require('../security/errors');

var SERVICE_URL = 'http://java.rchilli.com/RChilliParser/services/RChilliParser?wsdl'
var USER_KEY = 'YOABEO3303Q';
var VERSION = '6.0.0';
var SUB_USER_ID = 'immaculateit';
var TIMEOUT = 120 * 1000;

var resumeParserClient = null;

var _getResumeParser = () => {
  return new Promise(
    (resolve, reject) => {
      if (resumeParserClient && resumeParserClient !== undefined)
        resolve(resumeParserClient);

      soap.createClient(SERVICE_URL, (err, client) => {
        if (err) reject(err);
        resolve(client);
      }, { timeout: TIMEOUT });
  });
};

var _parseResume = (resumeParser, resumeDtoToSave) => {
  return new Promise(
    (resolve, reject) => {
      if (!resumeParser && resumeParser === undefined)
        reject(Errors.resumeParserIsEmpty);
      if (!resumeDtoToSave && resumeDtoToSave === undefined)
        reject(Errors.resumeDtoIsEmpty);

        var options = {
          url: resumeDtoToSave.url,
          userkey: USER_KEY,
          version: VERSION,
          subUserId: SUB_USER_ID
       }

      console.info('\nparsing resume: %s', resumeDtoToSave.url);
      resumeParser.parseResume(options, (err, res) => {
        console.info('\nin callback');
        if (err) {
          console.error('\nerr: ' + err);
          reject(err);
        }

        if (res) console.info('\nres: ' + res);

        var xml = res.return;
        console.log('\n parsed resume: %s: ', xml);
        resolve(xml);
      }, { timeout: TIMEOUT });
  });
};

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

exports.addResume = (resumeDto) => {
  return new Promise(
    (resolve, reject) => {
      var resumeDtoToSave = null;
      _validate(resumeDto)
      .then(validResumeDto => {
        resumeDtoToSave = validResumeDto;
        return _getResumeParser();
      })
      .then(resumeParser => {
        console.info('\nresumeParser: %j', util.inspect(resumeParser));
        return _parseResume(resumeParser, resumeDtoToSave);
      })
      .then(parsedResumeJson => {
        console.info('\nparsedResumeJson: %s', JSON.stringify(parsedResumeJson));
        resumeDtoToSave.parsedJson = parsedResumeJson;

        var resumeObj = new Profile(resumeDtoToSave);
        return resumeObj.save();
      })
      .then(savedResume => {
        console.info('\nsavedResume: %s', JSON.stringify(savedResume));
        resolve(savedResume);
      })
      .catch(err => {
        console.error('\nerr: %s', JSON.stringify(err));
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });

      return resumeDto;
  })
}
