var fs = require('fs');
var soap = require('soap');
var Job = require('../models/job-model').Job;
var JobProfile = require('../models/job-profile-model').JobProfile;

const Configuration = require('../../configuration').configuration;
const xml2js = require('xml2js');

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
        console.info('\njdFileData: %j', jdFileData);
        jobDtoToSave.file = jdFileData;
        return _parseJobSoap(jobDtoToSave);
      })
      .then(parsedJobXml => {
        if (/error/.test(parsedJobXml) === true) {
          throw(parsedJobXml);
        }
        console.info('\nparsedJobXml: %j', parsedJobXml);
        return _convertXmlToJson(parsedJobXml);
      })
      .then(parsedJobJson => {
        console.info('\nparsedJobJson: %j', parsedJobJson);
        jobDtoToSave.parsedJson = parsedJobJson;
        var jobObj = new Job(jobDtoToSave);
        return jobObj.save();
      })
      .then(savedJob => {
        console.info('\nsavedJob: %s', JSON.stringify(savedJob.name));
        resolve(savedJob);
      })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err.toString()});
        }
        reject(err);
      });

      return jobDto;
  });
};

exports.getJobsByProfile = (profileUuid) => {
  return new Promise(
    (resolve, reject) => {
      Job.find({profile: profileUuid}).exec()
       .then(jobs => { resolve(jobs); })
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
       .then(jobs => { resolve(jobs); })
       .catch(err => {
         if (err.code === undefined) {
           reject({code: '500', reason: err});
         }
         reject(err);
       });
  });
};
