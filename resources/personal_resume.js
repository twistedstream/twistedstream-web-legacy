'use strict';

var assert = require('assert');
var request = require('request');
var secure = require('../lib/secure');

assert(process.env.PERSONAL_RESUME_PDF_URL, 'Missing required environment variable: PERSONAL_RESUME_PDF_URL');

module.exports = function (app) {
  app.get('/api/personal_resume', function *() {
    secure(this);

    this.response.type = 'application/pdf';
    this.body = request.get(process.env.PERSONAL_RESUME_PDF_URL);
  });
};
