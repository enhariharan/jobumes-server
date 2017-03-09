var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = Schema({
  uuid: {type: String, required: [true, 'profile uuid is required']},
  timestamp: {type: Date, required: [true, 'creation timestamp is required']},
  firstName: {type: String, required: [true, 'first name is required']},
  lastName: {type: String, required: [true, 'last name is required']},
  middleName: String,
  gender: String,
  profilePicPath: String,
  user: {type: String, ref: 'User'}

  // TODO: Add social networks
});

exports.Profile  = mongoose.model('Profile', profileSchema);
