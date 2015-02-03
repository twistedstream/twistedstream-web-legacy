'use strict';

var assert = require('assert');
var httpAssert = require('http-assert');
var jwt = require('jsonwebtoken');
var code = require('../lib/evaluator');

assert(process.env.JWT_SECRET, 'Missing required environment variable: JWT_SECRET');

module.exports = function (app) {
  app.post('/api/answer', function *() {
    httpAssert(this.request.body.code, 400, 'Missing required field: code');

    var result = yield code.test(this.request.body.code);

    if (result.passed) {
      this.status = 200;

      this.body = {
        access_token: jwt.sign({
            message: 'I got in!'
          },
          process.env.JWT_SECRET, {
            expiresInMinutes: 15,
            subject: 'flynn'
          })
      };
    } else {
      this.status = 400;
      var message;

      switch (result.reason) {
        case 'incorrect':
          message = "Hmm, your code didn't quite pass all evaluation tests.";
          break;
        case 'timeout':
          message = 'Sorry, your code took too long to execute.';
          break;
        default:
          message = result.reason;
      }
      this.body = {
        message: message
      };
    }
  });
};
