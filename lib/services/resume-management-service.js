var fs = require('fs');
var path = require('path');
var soap = require('soap');
var util = require('util');
var restler = require('restler');

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

var _parseResumeSoap = (resumeUrl) => {
  return new Promise(
    (reject, resolve) => {
      soap.createClient(Configuration.resumeParser.serviceUrlSoap, (err, client) => {
        if (err) {
          return console.error('error =>', err);
          reject(err)
        }
        console.info('created RChilli client for URL: ' + Configuration.resumeParser.serviceUrlSoap);

        var options = {
          url: resumeUrl,
          userkey: Configuration.resumeParser.userKey,
          version: Configuration.resumeParser.version,
          subUserId: Configuration.resumeParser.subUserId
        }

        console.info('Now parsing resume: ' + options.url);
        client.parseResume(options, (err, res) => {
          if (err) {
            return console.error('error =>', err);
            reject(err)
          }
          var xml = res.return;
          if (/error/.test(xml) === true) {
            console.log('xml contains \'error\'');
            reject(xml);
          }
          else {
            console.log('xml does not contain \'error\'');
            resolve(xml);
          }
        }, { timeout: 120 * 1000 }); // client.parseResume(...
      }); // soap.createClient(Configuration.resumeParser.serviceUrl, (err, client) => {...
  }); // return new Promise( (reject, resolve) => { ...
};

var _parseResumeRest = (resumeUrl) => {
  return new Promise(
    (reject, resolve) => {
      var url = Configuration.resumeParser.serviceUrl + '/parseResume';
      var data = {
        url: resumeUrl,
        userkey: Configuration.resumeParser.userKey,
        version: Configuration.resumeParser.version,
        subUserId: Configuration.resumeParser.subUserId
      };
      var options = {
        method: 'post',
      };
      restler.postJson(url, data, options)
        .on('success', (data, res) => {
          console.info('request success');
          console.info('data: %j', data);
          console.log('res.body: %j', res.body);
          console.log('res.headers: %j', res.headers);
        })
        .on('complete', (result, res) => {
          console.info('request complete');
          console.info('result: %s', JSON.stringify(result));
          console.log('res.body: %j', res.body);
          console.log('res.headers: %j', res.headers);
          resolve(res.body);
        })
        .on('error', (err, res) => {
          console.info('request error');
          console.info('err: %j', err);
          console.log('res.body: %j', res.body);
          console.log('res.headers: %j', res.headers);
          reject(res.body);
        })
        .on('abort', () => {
          console.info('aborted...');
          reject();
        })
        .on('fail', (data, res) => {
          console.info('request failed');
          console.log('data: %j', data);
          console.log('res.body: ' + res.body);
          console.log('res.headers: %j', res.headers);
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
        // return _parseResumeSoap(resumeDtoToSave.url);
        return _parseResumeRest(resumeDtoToSave.url);
      })
      .then(parsedResumeJson => {
        console.log('\nparsedResumeJson: ' + parsedResumeJson);
        if (/error/.test(parsedResumeJson) === true) {
          console.info('\nthrowing error');
          throw(parsedResumeJson);
        }
          console.log('\nAll good, returning resume');
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
  })
}

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
