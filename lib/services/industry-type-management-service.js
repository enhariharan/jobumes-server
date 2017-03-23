var IndustryType = require('../models/industry-type-model').IndustryType;
var User = require('../models/user-model').User;
var Errors = require('../security/errors');

exports.getAllIndustryTypes = (callback) => {
  return new Promise(
    (resolve, reject) => {
      IndustryType.find()
       .then(industrytypes => { resolve(industrytypes); })
       .catch(err => {
         if (err.code === undefined) reject({code: '500', reason: err});
         reject(err);
       });
  });
}

exports.addIndustryType = (industrytype) => {
  return new Promise(
    (resolve, reject) => {
      console.log("1");
      var industryTypeToSave = new IndustryType(industrytype);
      industryTypeToSave.save()
      .then(savedIndustryType => {
        console.log("2");
        resolve(savedIndustryType); })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
}
