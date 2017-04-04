var Utils = require('../../../app/utilities');

exports.Feedback = (feedback) => {
  this.uuid = feedback.uuid;
  this.timestamp= feedback.timestamp;
  this.thinkingtocommentfor = feedback.thinkingtocommentfor;
  this.relationship = feedback.relationship;
  this.name = feedback.name
  this.emailid = feedback.emailid;
  this.subject = feedback.subject;
  this.comment = feedback.comment;
};

exports.save = () => {
  return new Promise(
    (resolve, reject) => {
      resolve(this);
  });
};

exports.find = () => {
  return new Promise(
    (resolve, reject) => {
      var feedbacks = [];
      feedbacks.push({
        this.uuid = Utils.getUuid();
        this.timestamp= Utils.getTimestamp();
        this.thinkingtocommentfor = 'feedback job 1';
        this.relationship = 'feedback relationship';
        this.name = 'feedback name 1';
        this.emailid = 'feedback.emailid1@gmail.com';
        this.subject = 'feedback subject 1';
        this.comment = 'feedback comment 1';
      });
      feedbacks.push({
        this.uuid = Utils.getUuid();
        this.timestamp= Utils.getTimestamp();
        this.thinkingtocommentfor = 'feedback job 2';
        this.relationship = 'feedback relationship';
        this.name = 'feedback name 2';
        this.emailid = 'feedback.emailid2@gmail.com';
        this.subject = 'feedback subject 2';
        this.comment = 'feedback comment 2';
      });
      resolve(feedbacks);
  });
};
