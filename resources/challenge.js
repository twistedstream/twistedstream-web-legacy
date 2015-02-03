'use strict';

var util = require('util');
var evaluator = require('../lib/evaluator');

module.exports = function (app) {
  app.get('/api/challenge', function *() {
    this.body = {
      code: util.format(
        evaluator.FUNCTION_TEMPLATE,
        '/* your code here */')
    };
  });
};
