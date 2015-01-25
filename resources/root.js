'use strict';

var thisPackage = require('../package');

module.exports = function (app) {
  app.get('/api', function *() {
    this.body = {
      service_name: thisPackage.description,
      app_version: thisPackage.version
    };
  });
};
