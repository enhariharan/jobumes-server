var Feedback = require('../models/employeefeedback-model').Feedback,
    Utilities = require('../models/utilities');

exports.addFeedback = (credentials, newEmployeeFeedbackDetails) => {
  return new Promise(
    (resolve, reject) => {
      var feedbackToSave = new Feedback(newEmployeeFeedbackDetails);

      feedbackToSave.save()
      .then(feedback => {
        console.log("feedback saved: "+JSON.stringify(feedback.uuid));
        resolve(feedback);
      })
      .catch(err => {
        console.log('\n newEmployeeFeedbackDetails resulted in error : ' + JSON.stringify(err) + ' ' + err);
        reject(err);
      });
  });
};
