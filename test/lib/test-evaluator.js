/* global describe, it */
/* jshint expr: true */
'use strict';

var expect = require('chai').expect;
require('co-mocha');
var helpers = require('../helpers');

var target = require('../../lib/evaluator');

describe("lib/evaluator", function () {
  it("should pass if satisfying code is provided", function *() {
    var response = yield target.test(helpers.passingCodeExpression);

    expect(response).to.have.property('passed', true);
  });

  it("should not pass (and provide a reason) if incorrect code is provided", function *() {
    var code = "return '0';";
    var response = yield target.test(code);

    expect(response).to.have.property('passed', false);
    expect(response).to.have.property('reason', 'incorrect');
  });

  it("should not pass if the provided code takes too long to execute", function *() {
    var code = "while (true) {\n" +
               "  console.log('do dee do...');" +
               "}";
    var response = yield target.test(code);

    expect(response).to.have.property('passed', false);
    expect(response).to.have.property('reason', 'timeout');
  });

  it("should not pass if the provided code has a syntax error", function *() {
    var code = "if x === 1 then return 42;";
    var response = yield target.test(code);

    expect(response).to.have.property('passed', false);
    expect(response).to.have.property('reason', 'error');
    expect(response).to.have.property('message', 'Unexpected identifier');
  });

  it("should not pass if the provided code throws an error", function *() {
    var code = "throw new Error(42);";
    var response = yield target.test(code);

    expect(response).to.have.property('passed', false);
    expect(response).to.have.property('reason', 'incorrect');
  });
});
