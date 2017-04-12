const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var organizationSchema = new Schema({
  uuid: {type: String, required: [true, 'organization uuid is required']},
  created: {
    timestamp: {type: Date, required: [true, 'creation timestamp is required']}, // timestamp
    by: {type: String, ref: 'Profile'}, // profile uuid of creator
  },
  lastModified: [{
    timestamp: {type: Date, required: [true, 'modified timestamp is required']}, // timestamp
    by: {type: String, ref: 'Profile'}, // profile uuid of modifier
  },],
  name:  {type: String, required: [true, 'organization name is required']},
  logo: {
    fileName: {type: String, required: [false]}, // path is not stored. Only filename.ext is stored.
    type: {type: String, required: [false]}, // MIME type of image.
    file: {type: Buffer, required: [false]}, // File contents of the image will be stored in this field.
    uri: {type: String, required:[false]}
  },
  status: {type: String, required: [true, 'organization status is required']}, // 'active', 'inactive'
  description: {type: String, required: [false]},
  address: {
    line1: {type: String, required: [false]},
    line2: {type: String, required: [false]},
    city: {type: String, required: [false]},
    state: {type: String, required: [false]},
    country: {type: String, required: [false]},
    zip: {type: String, required: [false]},
    googleMapsUri: {type: String, required: [false]},
  },
  internet: [{
    name: {type: String, required: [false]}, // "primary", "home page", "page-title", ...
    url: {type: String, required: [false]}
  }],
  email: [{
    name: {type: String, required: [false]}, // "primary", ...
    id: {type: String, required: [false]},
  }],
  phone: [{
    name: {type: String, required: [false]}, // "primary", ...
    number: {type: String, required: [false]},
  }],
  socialProfile : [{
    name: {type: String, required: [false]}, // 'facebook', 'linkedin', 'google'
    url: {type: String, required: [false]},
  }],
});

exports.Organization = mongoose.model('Organization', organizationSchema);
