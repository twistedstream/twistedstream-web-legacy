'use strict';

var assert = require('assert');
var secure = require('../lib/secure');

assert(process.env.STACK_OVERFLOW_CAREERS_URL, 'Missing required environment variable: STACK_OVERFLOW_CAREERS_URL');

module.exports = function (app) {
  app.get('/api/stackoverflow_resume', function *() {
    secure(this);

    this.redirect(process.env.STACK_OVERFLOW_CAREERS_URL);
  });
};
