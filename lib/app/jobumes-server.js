/*
 * jobumes-server
 * https://github.com/enhariharan/jobumes-server
 *
 * Copyright (c) 2017 Hariharan Narayanan
 * Licensed under the private license.
 */

'use strict';

var express = require('express');
var http = require('http');
var app = express();
var mongoose = require('mongoose');

var appInfo = require('../../package.json');
var configuration = require('../../configuration').configuration;
// var routes = require('./routes.js');

// return mongodb connection string
var getDbConnection = (env) => {
  switch(env) {
    case 'development': return configuration.mongo.development.connectionString;
    case 'test': return configuration.mongo.test.connectionString;
    case 'production': return configuration.mongo.production.connectionString;
    default: return null;
  }
};

// Create the app and start server.
var startServer = () => {
  "use strict";

  var webServer = http.createServer(app);
  webServer.listen(app.get('port'), function() {
    console.log('(%s) started on port (%d) in (%s) mode; press Ctrl+C to terminate', appInfo.name, app.get('port'), app.get('env'));
  });
};

// connect to database
app.set('port', configuration.server.port || 9060);

// configure mongoose to connect to our MongoDB database
var opts = { server: { socketOptions: { keepAlive: 1 } } };

// Connect to MongoDB database instance
mongoose.connect(getDbConnection(app.get('env')), opts);

// configure REST API routes
// routes(app);

// Create the app and start server.
if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}
