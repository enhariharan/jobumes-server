const fs = require('fs');
const path = require('path');
const soap = require('soap');
const util = require('util');
const http = require('http');

const Errors = require('../security/errors');
const Config = require('../../configuration').configuration;
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

var _parseResumeRest = (file, filename) => {
  return new Promise(
    (resolve, reject) => {
      requestData = JSON.stringify({
        'filedata': file,
        'filename': filename,
        'userkey': Config.resumeParser.userKey,
        'version': Config.resumeParser.version,
        'subuserid': Config.resumeParser.subUserId,
      });

      var requestHeaders = {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData, 'utf8')
      };

      var postOptions = {
          host: Config.resumeParser.host,
          port: Config.resumeParser.port,
          path: Config.resumeParser.path,
          method: Config.resumeParser.method,
          headers: requestHeaders
      };

      var result = null;
      var handleDataReceived = (data) => {
        process.stdout.write('.');

        if (/error/.test(data) === true) reject(data);

        if (!result) result = data;
        else result = result + data;
      };

      var handleDataReceiveFinished = () => {
        var json = JSON.parse(result);
        if (/error/.test(json) === true) reject(json);
        else resolve(json);
      };

      var handleError = (err) => { reject(err); };

      var handlePostResponse = (response) => {
        console.log("received status from RChilli: ", response.statusCode);
        response.on('data', handleDataReceived);
        response.on('end', handleDataReceiveFinished);
      };

      console.log('Converting resume to JSON through RChilli service...');
      var postRequest = http.request(postOptions, handlePostResponse);
      postRequest.write(requestData);
      postRequest.end();
      postRequest.on('error', handleError);
  });
};

var _parseResumeFileContents = (filename) => {
  return new Promise(
    (resolve, reject) => {
       var data = fs.readFileSync(filename);
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

// Get Resumes by Uuid
exports.getResumesByProfileAndResumeUuid = (profileUuid,resumeUuid) => {
  return new Promise(
    (resolve, reject) => {
      Resume.find({profile: profileUuid, status: 'active', resume: resumeUuid}).exec()
      .then(resumes => {
        var resumesDto = {
          profile: profileUuid,
          resumes: resumes.map(resume => {
            var r = {
              uuid: resumeUuid,
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
      _parseResumeFileContents(resumeFileMetadata.path)
      .then(resumeFileData => {
        resumeDtoToSave.file = resumeFileData;
        console.info('contents.length: ' + resumeFileData.length);
        return _parseResumeRest(resumeFileData, resumeFileMetadata.filename);
      })
      .then(parsedResumeJson => {
        console.log('parsedResumeJson: %j', parsedResumeJson);
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
    });
};

exports.addCoverLetterToResume = (coverLetterDto) => {
  return new Promise(
    (resolve, reject) => {
      if (!coverLetterDto.coverLetter || coverLetterDto.coverLetter === undefined ) throw(Errors.coverLetterNotPresent);

      Resume.findOne({uuid: coverLetterDto.uuid}).exec()
      .then(resume => {
        if (!resume || resume === undefined ) throw(Errors.resumeWithGivenUuidNotFound);
        console.info('cover letter before change: %j', resume.parsedJson.ResumeParserData.Coverletter);
        return Resume.update({uuid: resume.uuid}, {$set: {'parsedJson.ResumeParserData.Coverletter': coverLetterDto.coverLetter}});
      })
      .then(updatedResume => {
        console.info('updatedResume.ok: %s', (updatedResume.n === 1 && updatedResume.ok === 1));
        if (updatedResume.n === 1 && updatedResume.ok === 1) return Resume.findOne({uuid: coverLetterDto.uuid}).exec();
        else throw(Errors.errorAddingCoverLetterToResume);
      })
      .then(resume => {
        console.info('cover letter after change: %s', resume.parsedJson.ResumeParserData.Coverletter);
        resolve(resume);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err.toString()});
        reject(err);
      });
  });
};
