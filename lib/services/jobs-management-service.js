var fs = require('fs');
var path = require('path');
var soap = require('soap');
var util = require('util');
var restler = require('restler');

var Errors = require('../security/errors');
var Configuration = require('../../configuration').configuration;
var Job = require('../models/job-model').Job;

var _validate = (jobDto) => {
  return new Promise(
    (resolve, reject) => {
      if (!jobDto.url || jobDto.url === undefined)
        reject(Errors.jobUrlCannotBeEmpty);

      if (!jobDto.name || jobDto.name === undefined)
        jobDto.name = "new job"; // put file name from url here
      if (!jobDto.status || jobDto.status === undefined)
        jobDto.name = "active"; // put file name from url here

      resolve(jobDto);
  });
};

var _parseJobSoap = (jobUrl) => {
  return new Promise(
    (reject, resolve) => {
      soap.createClient(Configuration.jobParser.serviceUrlSoap, (err, client) => {
        if (err) {
          return console.error('error =>', err);
          reject(err)
        }
        console.info('created RChilli client for URL: ' + Configuration.jobParser.serviceUrlSoap);

        var options = {
          url: jobUrl,
          userkey: Configuration.jobParser.userKey,
          version: Configuration.jobParser.version,
          subUserId: Configuration.jobParser.subUserId
        }

        console.info('Now parsing job: ' + options.url);
        client.parseJob(options, (err, res) => {
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
        }, { timeout: 120 * 1000 }); // client.parseJob(...
      }); // soap.createClient(Configuration.jobParser.serviceUrl, (err, client) => {...
  }); // return new Promise( (reject, resolve) => { ...
};

exports.addJob = (jobDto) => {
  return new Promise(
    (resolve, reject) => {
      var jobDtoToSave = null;
      _validate(jobDto)
      .then(validjobDto => {
        jobDtoToSave = validJobDto;
        // return _parseJobSoap(jobDtoToSave.url);
        return _parseJobSoap(jobDtoToSave.url);
      })
      .then(parsedJobJson => {
        console.log('\nparsedJobJson: ' + parsedJobJson);
        if (/error/.test(parsedJobJson) === true) {
          console.info('\nthrowing error');
          throw(parsedJobJson);
        }
          console.log('\nAll good, returning job');
          jobDtoToSave.parsedJson = parsedJobJson;
          var jobObj = new job(jobDtoToSave);
          return jobObj.save();
      })
      .then(savedJob => {
        console.info('\nsavedJob: %s', JSON.stringify(savedJob.name));
        resolve(savedJob);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err.toString()});
        reject(err);
      });

      return jobDto;
  })
}
