var FunctionalArea = require('../models/functional-area-model').FunctionalArea;

exports.getAllFunctionalAreas = () => {
  return new Promise(
    (resolve, reject) => {
      FunctionalArea.find()
       .then(functionalareas => { resolve(functionalareas); })
       .catch(err => {
         if (err.code === undefined) { reject({code: '500', reason: err}); }
         reject(err);
       });
  });
};

exports.addFunctionalArea = (functionalarea) => {
  return new Promise(
    (resolve, reject) => {
      var functionalAreaToSave = new FunctionalArea(functionalarea);
      functionalAreaToSave.save()
      .then(savedFunctionalArea => { resolve(savedFunctionalArea); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};
