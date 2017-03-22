const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var profileSchema = Schema({
  uuid: {type: String, required: [true, 'profile uuid is required']},
  created: {
    timestamp: {type: Date, required: [true, 'creation timestamp is required']}, // timestamp
    by: {type: String, ref: 'Profile'}, // profile uuid of creator
  },
  lastModified: [{
    timestamp: {type: Date, required: [true, 'modified timestamp is required']}, // timestamp
    by: {type: String, ref: 'Profile'}, // profile uuid of modifier
  },],
  // 'new user', 'registered', 'activated', 'deleted'
  status: {type: String, required: [true, 'profile status is required']},
  role: {type: String, ref: 'Role'}, // UUID of the role of this user
  login: {
    username: {type: String, required: [true, 'username (email) is required']}, // email is login username
    password: {type: String, required: [true, 'password is required']}, // TODO: BCrypt hash to be stored here.
  },
  firstName: {type: String, required: [true, 'first name is required']},
  middleName: String,
  lastName: {type: String, required: [true, 'last name is required']},
  email: {type: String, required: [true, 'email is required']}, // this may or may not be same as login.username
  phoneNumber: {type: String, required: [true, 'phonenumber is required']},
  gender: String, // 'male' or 'female'
  image: {
    fileName: String, // path is not stored. Only filename.ext is stored.
    type: String, // MIME type of image.
    file: Buffer, // File contents of the image will be stored in this field.
  },
  socialProfiles : [{
    socialNetworkName: String, // 'facebook', 'linkedin', 'google'
    email: String, // email used to login into the social account
    details: Object, // JSON object as returned by the social network.
  },],
});

exports.Profile  = mongoose.model('Profile', profileSchema);
