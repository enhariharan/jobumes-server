var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = Schema({
  uuid: {type: String, required: [true, 'profile uuid is required']},
  createdOn: {type: Date, required: [true, 'creation timestamp is required']},
  createdBy: {type: String, ref: 'Profile'},
  lastModified: [{
    modifiedBy: {type: String, ref: 'Profile'},
    modifiedOn: {type: Date, required: [true, 'modified timestamp is required']},
  },],
  status: {type: String, required: [true, 'profile status is required']}, // 'created', 'active', 'inactive'
  login: {
    username: {type: String, required: [true, 'username (email) is required']},
    password: {type: String, required: [true, 'password is required']}, // TODO: BCrypt hash to be stored here.
  },
  firstName: {type: String, required: [true, 'first name is required']},
  middleName: String,
  lastName: {type: String, required: [true, 'last name is required']},
  email: {type: String, required: [true, 'email is required']},
  gender: String,
  image: {
    fileName: String,
    type: String,
    file: Buffer,
  },
  socialProfiles : [{
    socialNetworkName: String,
    email: String,
    details: Object,
  },],
});

exports.Profile  = mongoose.model('Profile', profileSchema);
