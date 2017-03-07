module.exports = {
  emptyRequestBody: {code: '400', reason: 'request body or request headers are empty.'},
  resumeUrlCannotBeEmpty: {code: '400', reason: 'resume URL cannot be empty.'},
  userProfileCouldNotBeFound: {code: '400', reason: 'user profile could not be found for given credentials.'},
  userCouldNotBeFound: {code: '400', reason: 'user could not be found for given credentials.'},
  invalidRoleUuid: {code: '400', reason: 'invalid role uuid was provided.'},
  invalidProfileUuid: {code: '400', reason: 'invalid profile uuid was provided.'},

  invalidCredentials: {code: '403', reason: 'invalid username or password.'},
  invalidCredentialsRoleNotAdmin: {code: '403', reason: 'invalid privileges: user is not admin.'},

  resumeProfileCannotBeEmpty: {code: '500', reason: 'Internal error: profile for this resume cannot be empty.'},
  resumeParserIsEmpty: {code: '500', reason: 'Internal error: resume parser is empty.'},
  resumeDtoIsEmpty: {code: '500', reason: 'Internal error: resume DTO is empty.'},
  errorWhileSavingResume: {code: '500', reason: 'Internal error: error while saving resume.'},
};
