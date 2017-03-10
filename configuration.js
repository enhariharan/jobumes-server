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
    // serviceUrlSoap: 'http://java.rchilli.com/RChilliParser/services/RChilliParser?wsdl',
    // serviceUrlRest: 'http://redgummi1.rchilli.com/RChilliParser/Rchilli/parseResumeBinary',
    // serviceUrl: 'http://redgummi1.rchilli.com/RChilliParser/Rchilli/parseResumeBinary',
    serviceUrl: 'http://redgummi1.rchilli.com/RChilliParser/Rchilli',
    userKey: 'YOABEO3303Q',
    version: '7.0.0',
    subUserId: 'redgummi',
    timeout: 120 * 1000
  },
  jdParser: {
    // serviceUrlSoap: 'http://redgummijd.rchilli.com/JDParser/services/JDParser?wsdl',
    // serviceUrlRest: '',
    serviceUrl: 'http://redgummijd.rchilli.com/JDParser/services/JDParser?wsdl',
    userKey: 'YOABEO3303Q',
    version: '2.0',
    subUserId: 'redgummi',
    timeout: 120 * 1000
  },
};

module.exports = {configuration};
