var BasicAuth = require('basic-auth');

var Validator = require('../security/validator');
var utils = require('../models/utilities');

var AdminService = require('../services/admin-service');
var RoleManagementService = require('../services/role-management-service');
var ProfileManagementService = require('../services/profile-management-service');
var RoleManagementService = require('../services/role-management-service');

/**
 * @api {get} / Get all jobs posted
 * @apiName getAllJobsPosted
 * @apiGroup Jobs
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Jobs[]} Jobs Array of Jobs.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [{
	"employerDetails": {
		"_id": "58d3a9280c99bf2e0ced15d6",
		"uuid": "b7f3e0ab-155f-4239-8c39-aef716a645ef",
		"status": "registered",
		"role": "eaf59120-c75b-4839-83ed-8e42d7d1da94",
		"firstName": "Pradeep",
		"lastName": "Ragiphani",
		"middleName": "Kumar",
		"gender": "male",
		"email": "pradeep.ragiphani007@gmail.com",
		"phoneNumber": "+918686549997",
		"socialProfiles": [],
		"login": {
			"username": "pradeep.ragiphani007@gmail.com"
		},
		"lastModified": [{
			"_id": "58de298d68c3c91370ef864e",
			"timestamp": "2017-03-31T10:03:57.729Z",
			"by": "b7f3e0ab-155f-4239-8c39-aef716a645ef"
		}],
		"created": {
			"timestamp": "2017-03-23T10:53:28.263Z"
		}
	},
	"jobUuid": "e67b2654-acc0-477a-8566-f57b74ea158b",
	"timestamp": "2017-03-27T13:10:49.099Z",
	"name": "jd-sample-1.txt",
	"status": "active",
	"parsedJson": {
		"JobData": {
			"JobDescription": ["Java Developer \rTALENT ASSURE EDUCATION SERVICES PVT LTD - Delhi , Delhi \rOpening: 3-4\rGood communication skills\r Experience of working in Advance Java , Swing , J2EE , Servlets , Struts , WEB &amp; WAP\rServices , Spring , Hibernate , Java Script , SQL , PL/SQL , JQuery , AJAX.\r Exposure to Software Development Life Cycles (SDLC).\r Worked on J2EE framework.\r Understanding of Eclipse , Java , JMS and JDBC , XML and XPath Basic , SOAP and\rWSDL Basic with good understanding of databases.\rKey Skills\r Advance Java\r Struts\r Hibernate\r Swing\rMinimum 1-2 year experience required\rJob Type: Full-time\r\rSalary: Rs 40 , 000.00 /month\r\rRequired education:\r\rB.Tech/ MCA /BCA\r\rContact Person\rPradeep Kumar\r9874563210\rparadeep104@gmail.com"],
			"InterviewLocation": [""],
			"InterviewTime": [""],
			"InterviewDate": [""],
			"InterviewType": [""],
			"WebSite": [""],
			"ContactPersonName": ["Pradeep Kumar"],
			"ContactPhone": [""],
			"ContactEmail": ["paradeep104@gmail.com"],
			"Skills": [{
				"Skill": [{
					"type": {
						"type": "required"
					},
					"name": "Advance Java"
				}, {
					"type": {
						"type": "required"
					},
					"name": "Swing"
				}, {
					"type": {
						"type": "required"
					},
					"name": "J2EE"
				}, {
					"type": {
						"type": "required"
					},
					"name": "Servlets"
				}, {
					"type": {
						"type": "required"
					},
					"name": "Struts"
				}, {
					"type": {
						"type": "required"
					},
					"name": "WAP"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "Communication Skills"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "Hibernate"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "Java Script"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "SQL"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "PL/SQL"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "JQuery"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "AJAX"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "Software Development Life Cycles"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "SDLC"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "J2EE Framework"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "Java"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "JMS and JDBC"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "XML and XPath Basic"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "SOAP And"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "WSDL Basic"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "Databases"
				}, {
					"type": {
						"type": "perferred"
					},
					"name": "Key Skills"
				}]
			}],
			"Certifications": [""],
			"Qualifications": [""],
			"Relocation": [""],
			"NoOfOpenings": ["3"],
			"NoticePeriod": [""],
			"SalaryOffered": ["Rs 40, 000.00/month"],
			"ExperienceRequired": ["1-2 year"],
			"PostedOnDate": [""],
			"IndustryType": [""],
			"JobType": ["Full-time"],
			"JobCode": [""],
			"Location": ["Delhi"],
			"Organization": ["TALENT ASSURE EDUCATION SERVICES PVT LTD"],
			"JobProfile": ["Java Developer"],
			"ParsingDate": ["Mon Mar 27 13:10:53 UTC 2017"],
			"FileName": ["jd-sample-1.txt"]
		}
	}
}, {
	"jobsCount": 2
}]
 */

 var _getEmployerDetails = (profileUuid) => {
   return new Promise(
     (resolve, reject) => {
      //  console.log("profile Uuid:: "+profileUuid);
    ProfileManagementService.getProfileByUuid(profileUuid)
     .then(empDetails => {
        //  console.log('applicant details from get applicant details: %j',empDetails);
       resolve(empDetails);
     });
   });
 };

exports.getAllJobsPosted = (req, res) => {
  "use strict";

  var moInfoNeeded = (req.query.moreInfo === 'true') ? true : false;
  console.log("moInfoNeeded:: "+moInfoNeeded);
  var period = req.query.period;
  // var period = req.query.period - '0';
  console.log("period = "+period);

  var returnJobsDTO = [];
  var jobsArray = [];
  var returnJobsCount = {};

  var current_date = new Date();

  var periodDate = "";
  if(period == "total"){
    periodDate = "total";
  }else{
    periodDate = current_date.setDate(current_date.getDate() - Number(period));
  }
  console.log("current_date:: "+periodDate);

  Validator.isUserAdmin(req)
  .then(result => {
    return AdminService.getAllJobsPosted(periodDate);
  })
  .then(jobs => {
    return new Promise(
      (resolve, reject) => {
        var i = 0;
        var m = jobs.length;
      console.log("applicants count: "+jobs.length);

    jobs.forEach(a => {
            i++;

         if(moInfoNeeded === true){
           var employerDTO = {};
           _getEmployerDetails(a.profile)
           .then(employerObj => {
               // console.log("jobApplicant more info: %j",employerObj);
             employerDTO.employerDetails = employerObj;
             employerDTO.jobUuid = a.uuid;
             employerDTO.timestamp = a.timestamp;
             employerDTO.name = a.name;
             employerDTO.status = a.status;
             employerDTO.parsedJson = a.parsedJson;

             returnJobsDTO.push(employerDTO);

              console.log("length of jobs array : "+jobs.length);
              if(i === m){
                 // console.log("jobApplicantsDTO more info: "+returnJobsDTO[0]);
                returnJobsCount.jobsCount = jobs.length;
                returnJobsDTO.push(returnJobsCount);
                resolve(returnJobsDTO);
              }
             })
             .catch(err => {throw err;});
         }else{
           if(i === m){
              // console.log("jobApplicantsDTO more info: "+returnJobsDTO[0]);
             returnJobsCount.jobsCount = jobs.length;
             returnJobsDTO.push(returnJobsCount);
             resolve(returnJobsDTO);
           }
         }

    });

  });
  })
  .then(returnJobsDTO => {
    // console.log('job applicants dto: %j',returnJobsDTO);
    return res.status('200').send(returnJobsDTO);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};


// To get all the employers registered in certain period of timestamp

exports.getAllRecruiterProfiles = (req, res) => {
  "use strict";

  var moInfoNeeded = (req.query.moreInfo === 'true') ? true : false;
  // console.log("moInfoNeeded:: "+moInfoNeeded);
  var period = req.query.period;
  // var period = req.query.period - '0';
  console.log("period = "+period);

  var returnRecruitersDTO = [];
  var recruitersArray = [];
  var returnRecruitersCount = {};

  var current_date = new Date();

  var periodDate = "";
  if(period == "total"){
    periodDate = "total";
  }else{
    periodDate = current_date.setDate(current_date.getDate() - Number(period));
  }
  console.log("current_date:: "+periodDate);

  Validator.isUserAdmin(req)
  .then(result => {
    return RoleManagementService.getRoleByRoleName("recruiter");
  }).then(role => {
    console.log('role:: %j',role);
  return AdminService.getAllProfilesAsPerRole(periodDate,role.uuid);
  })
  .then(recruiters => {
     return new Promise(
       (resolve, reject) => {
         var i = 0;
         var m = recruiters.length;
        if(m !== 0){
          recruiters.forEach(a => {
                  i++;
               if(moInfoNeeded === true){
                 var employerDTO = {};
                   employerDTO.employerDetails = a;

                   returnRecruitersDTO.push(employerDTO);

                    console.log("length of jobs array : "+recruiters.length);
                    if(i === m){
                       // console.log("jobApplicantsDTO more info: "+returnJobsDTO[0]);
                      returnRecruitersCount.recruitersCount = recruiters.length;
                      returnRecruitersDTO.push(returnRecruitersCount);
                      resolve(returnRecruitersDTO);
                    }

               }else{
                 if(i === m){
                    // console.log("jobApplicantsDTO more info: "+returnJobsDTO[0]);
                   returnRecruitersCount.recruitersCount = recruiters.length;
                   returnRecruitersDTO.push(returnRecruitersCount);
                   resolve(returnRecruitersDTO);
                 }
               }

          });
        }else{
          returnRecruitersCount.recruitersCount = 0;
          returnRecruitersDTO.push(returnRecruitersCount);
          resolve(returnRecruitersDTO);
        }

   });
  })
  .then(returnRecruitersDTO => {
     console.log('returnRecruitersDTO :: %j',returnRecruitersDTO);
    return res.status('200').send(returnRecruitersDTO);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

// To get all the job seekers registered in certain period of timestamp

exports.getAllEmployeeProfiles = (req, res) => {
  "use strict";

  var moInfoNeeded = (req.query.moreInfo === 'true') ? true : false;
  // console.log("moInfoNeeded:: "+moInfoNeeded);
  var period = req.query.period;
  // var period = req.query.period - '0';
  console.log("period = "+period);

  var returnEmployeesDTO = [];
  var returnEmployeesCount = {};

  var current_date = new Date();

  var periodDate = "";
  if(period == "total"){
    periodDate = "total";
  }else{
    periodDate = current_date.setDate(current_date.getDate() - Number(period));
  }
  console.log("current_date:: "+periodDate);

  Validator.isUserAdmin(req)
  .then(result => {
    return RoleManagementService.getRoleByRoleName("jobseeker");
  }).then(role => {
    console.log('role:: %j',role);
  return AdminService.getAllProfilesAsPerRole(periodDate,role.uuid);
  })
  .then(employees => {
     return new Promise(
       (resolve, reject) => {
         var i = 0;
         var m = employees.length;
         console.log("m:: "+m);
         if(m !== 0){
           employees.forEach(a => {
                   i++;
                if(moInfoNeeded === true){
                  var employeeDTO = {};
                    employeeDTO.employeeDetails = a;

                    returnEmployeesDTO.push(employeeDTO);

                     console.log("length of jobs array : "+employees.length);
                     if(i === m){
                      returnEmployeesCount.employeesCount = m;
                       returnEmployeesDTO.push(returnEmployeesCount);
                       resolve(returnEmployeesDTO);
                     }

                }else{
                  if(i === m){
                    returnEmployeesCount.employeesCount = m;
                    returnEmployeesDTO.push(returnEmployeesCount);
                    resolve(returnEmployeesDTO);
                  }
                }

           });
         }else{
           returnEmployeesCount.employeesCount = 0;
           returnEmployeesDTO.push(returnEmployeesCount);
           resolve(returnEmployeesDTO);
         }


   });
  })
  .then(returnEmployeesDTO => {
     console.log('returnEmployeesDTO :: %j',returnEmployeesDTO);
    return res.status('200').send(returnEmployeesDTO);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
