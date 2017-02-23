var configuration = {
  server: {
    port: 9060,
  },
  mongo: {
    development: {connectionString: 'mongodb://localhost/jobumes-development',},
    test: {connectionString: 'mongodb://localhost/jobumes-test',},
    production: {connectionString: 'mongodb://produser:resudorp@ds145158.mlab.com:45158/jobumes-prod',},
  },
};

module.exports = {configuration};
