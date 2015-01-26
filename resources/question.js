'use strict';

var assert = require('http-assert');
var jws = require('jws');
var code = require('../lib/evaluator');

require('assert')(process.env.JWT_SECRET, 'Missing required environment variable.');

module.exports = function (app) {
  app.post('/api/question', function *() {
    assert(this.request.body.code, 400, 'Missing required field: code');

    var result = yield code.test(this.request.body.code);

    if (result.passed) {
      this.status = 200;

      this.body = {
        access_token: jws.sign({
          header: { alg: 'HS256' },
          payload: 'I got in!',
          secret: process.env.JWT_SECRET,
        })
      };
    } else {
      this.status = 400;
      var message;

      switch (result.reason) {
        case 'incorrect':
          message = 'The provided code did not pass all evaluation tests.';
          break;
        case 'timeout':
          message = 'The provided code took too long to execute.';
          break;
        default:
          message = 'result.reason';
      }
      this.body = {
        message: message
      };
    }
  });
};
