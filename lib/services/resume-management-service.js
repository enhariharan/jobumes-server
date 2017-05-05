const fs = require('fs');
const http = require('http');

const Errors = require('../security/errors');
const Config = require('../../configuration').configuration;
const Resume = require('../models/resume-model').Resume;

var _parseResumeRest = (file, filename) => {
  return new Promise(
    (resolve, reject) => {
      var requestData = JSON.stringify({
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

        if (/error/.test(data) === true) {
          reject(data);
        }

        if (!result) {
          result = data;
        }
        else {
          result = result + data;
        }
      };

      var handleDataReceiveFinished = () => {
        var json = JSON.parse(result);
        if (/error/.test(json) === true) {
          reject(json);
        }
        else {
          resolve(json);
        }
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

//jshint unused:false
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
            if(!resume.updateParsedJson || resume.updateParsedJson === undefined){
              var r = {
                uuid: resume.uuid,
                timestamp: resume.timestamp,
                name: resume.name,
                fullname: resume.parsedJson.ResumeParserData.FirstName+" "+resume.parsedJson.ResumeParserData.LastName,
                phone: resume.parsedJson.ResumeParserData.Phone,
                mobile: resume.parsedJson.ResumeParserData.Mobile,
                email : resume.parsedJson.ResumeParserData.Email,
                address: resume.parsedJson.ResumeParserData.Address,
                jobProfile: resume.parsedJson.ResumeParserData.JobProfile,
                coverLetter: resume.parsedJson.ResumeParserData.Coverletter
              };
              return r;
            }else{
              var r = {
                uuid: resume.uuid,
                timestamp: resume.timestamp,
                name: resume.name,
                fullname: resume.updateParsedJson.ResumeParserData.FirstName+" "+resume.updateParsedJson.ResumeParserData.LastName,
                phone: resume.updateParsedJson.ResumeParserData.Phone,
                mobile: resume.updateParsedJson.ResumeParserData.Mobile,
                email : resume.updateParsedJson.ResumeParserData.Email,
                address: resume.updateParsedJson.ResumeParserData.Address,
                jobProfile: resume.updateParsedJson.ResumeParserData.JobProfile,
                coverLetter: resume.updateParsedJson.ResumeParserData.Coverletter
              };
              return r;
            }
          }),
        };
        resolve(resumesDto);
      })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err.toString()});
        }
        reject(err);
      });
  });
};

// Get Resumes by Uuid
exports.getResumesByProfileAndResumeUuid = (profileUuid,resumeUuid) => {
  return new Promise(
    (resolve, reject) => {
      Resume.find({profile: profileUuid, status: 'active', uuid: resumeUuid}).exec()
      .then(resumes => {
        var resumesDto = {
          profile: profileUuid,
          resumes: resumes.map(resume => {
            var r = {
              uuid: resumeUuid,
              timestamp: resume.timestamp,
              name: resume.name,
              details: resume.updateParsedJson,
            };
            return r;
          }),
        };
        console.log('resumes DTO: %j', resumesDto);
        resolve(resumesDto);
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err.toString()}); }
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
        resumeDtoToSave.updateParsedJson = parsedResumeJson;
        var resumeObj = new Resume(resumeDtoToSave);
        return resumeObj.save();
      })
      .then(savedResume => {
        console.info('\nsavedResume: %s', JSON.stringify(savedResume.name));
        resolve(savedResume);
      })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err.toString()});
        }
        reject(err);
      });
    });
};

exports.addCoverLetterToResume = (coverLetterDto) => {
  return new Promise(
    (resolve, reject) => {
      if (!coverLetterDto.coverLetter || coverLetterDto.coverLetter === undefined ) {
        throw(Errors.coverLetterNotPresent);
      }

      Resume.findOne({uuid: coverLetterDto.uuid}).exec()
      .then(resume => {
        if (!resume || resume === undefined ) {
          throw(Errors.resumeWithGivenUuidNotFound);
        }
        console.info('cover letter before change: %j', resume.parsedJson.ResumeParserData.Coverletter);
        return Resume.update({uuid: resume.uuid}, {$set: {'parsedJson.ResumeParserData.Coverletter': coverLetterDto.coverLetter,'updateParsedJson.ResumeParserData.Coverletter': coverLetterDto.coverLetter}});
      })
      .then(updatedResume => {
        console.info('updatedResume.ok: %s', (updatedResume.n === 1 && updatedResume.ok === 1));
        if (updatedResume.n === 1 && updatedResume.ok === 1) {
          return Resume.findOne({uuid: coverLetterDto.uuid}).exec();
        }
        else {
          throw(Errors.errorAddingCoverLetterToResume);
        }
      })
      .then(resume => {
        console.info('cover letter after change: %s', resume.updateParsedJson.ResumeParserData.Coverletter);
        resolve(resume);
      })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err.toString()});
        }
        reject(err);
      });
  });
};

exports.getResumeByUuid = (resumeUuid) => {
  return new Promise(
    (resolve, reject) => {
      Resume.find({uuid: resumeUuid},{"uuid":1,"timestamp":1,"name":1,"parsedJson":1,"updateParsedJson":1}).exec()
      .then(resumes => {
        resolve(resumes);
      })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err.toString()});
        }
        reject(err);
      });
  });
};
exports.checkResume = (resumeUuid,profileUuid) => {
  return new Promise(
    (resolve, reject) => {
        var query ={"uuid": resumeUuid,"profile":profileUuid};

      Resume.find(query).exec()
      .then(res=> {
        console.log("res %j",res.length);
         if (res.length===0) {throw (Errors.unauthorisedUserForResume); }

       resolve(res);
      })
      .catch(err => {

        reject(err);
      });
  });
};
/**Start Delete Functionality */
exports.deleteResume = (resumeUuid) => {
  return new Promise(
    (resolve, reject) => {
        var query ={uuid: resumeUuid};
      var update = {$set:{"status":"inactive"}};
      Resume.findOneAndUpdate(query, update).exec()
      .then(res=> {
        resolve({code:200,'Response':'Done'});
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

/**Start Search Functionality */
exports.searchResume = (searchstring) => {
  return new Promise(
    (resolve, reject) => {
      console.log("searchstring",searchstring.search);
        var query ={'parsedJson.ResumeParserData.Skills': {'$regex': searchstring.search}};
        var fetchFeilds = {"uuid":1,"parsedJson.ResumeParserData":1,"name":1,"type":1,"status":1,"updateParsedJson.ResumeParserData":1};
     console.log(query,fetchFeilds);
      Resume.find(query,fetchFeilds).exec()
      .then(res=> {
      if (res.length===0) {throw (Errors.unauthorisedUserForResume); }

       resolve(res);
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

/**Start Edit Functionality */
exports.editResume = (resumeUuid,resumeJson) => {
  return new Promise(
    (resolve, reject) => {
      var fullname = resumeJson.firstName+" "+resumeJson.lastName;
      var certification = {};
      certification.certificationName = resumeJson.certificationName;
      certification.certifiedOn = resumeJson.certifiedOn;


        var query ={uuid: resumeUuid};
      var update = {$set:{"updateParsedJson.ResumeParserData.Achievements":resumeJson.Achievements,
                          "updateParsedJson.ResumeParserData.FirstName":resumeJson.firstName,
                          "updateParsedJson.ResumeParserData.FullName":fullname,
                          "updateParsedJson.ResumeParserData.LastName":resumeJson.lastName,
                          "updateParsedJson.ResumeParserData.Email":resumeJson.Email,
                          "updateParsedJson.ResumeParserData.Phone":resumeJson.Phone,
                          "updateParsedJson.ResumeParserData.FormattedAddress":resumeJson.FormattedAddress,
                          "updateParsedJson.ResumeParserData.ExecutiveSummary":resumeJson.ExecutiveSummary,
                          "updateParsedJson.ResumeParserData.Certification":certification,
                          "updateParsedJson.ResumeParserData.CurrentEmployer":resumeJson.CurrentEmployer,
                          "updateParsedJson.ResumeParserData.SegregatedExperience.WorkHistory":resumeJson.WorkHistory,
                          "updateParsedJson.ResumeParserData.SkillKeywords.SkillSet":resumeJson.SkillSet,
                          "updateParsedJson.ResumeParserData.SegregatedQualification.EducationSplit":resumeJson.EducationSplit }};

            console.log('update :: %j',update);
      Resume.findOneAndUpdate(query, update).exec()
      .then(res=> {
        resolve({code:200,'Response':'Done'});
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};
