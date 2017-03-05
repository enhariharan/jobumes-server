var configuration = {
  server: {
    port: 9060,
  },
  mongo: {
    development: {connectionString: 'mongodb://localhost/jobumes-development',},
    test: {connectionString: 'mongodb://localhost/jobumes-test',},
    production: {connectionString: 'mongodb://produser:resudorp@ds145158.mlab.com:45158/jobumes-prod',},
  },
  resumeParser: {
    serviceUrl: 'http://java.rchilli.com/RChilliParser/services/RChilliParser?wsdl',
    userKey: 'YOABEO3303Q',
    version: '6.0.0',
    subUserId: 'immaculateit',
    timeout: 120 * 1000
  },
};

module.exports = {configuration};
