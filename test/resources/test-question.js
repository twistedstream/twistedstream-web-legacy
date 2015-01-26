/* global describe, it */
/* jshint expr: true */
'use strict';

var jws = require('jws');
var app = require('../../app');
var expect = require('chai').expect;
require('co-mocha');
var helpers = require('../helpers');

var request = require('co-supertest').agent(app.callback());

describe("API Question (/question) resource", function () {
  it("POST with no code should return a 400 due to a missing field", function *() {
    var response = yield request
      .post('/api/question')
      .send({})
      .expect(400)
      .end();

    var body = response.body;
    expect(body).to.have.property('message')
      .and.match(/missing required field/i);
  });

  it("POST with incorrect code should return a 400 due to not passing tests", function *() {
    var response = yield request
      .post('/api/question')
      .send({
        code: 'return 42;'
      })
      .expect(400)
      .end();

    var body = response.body;
    expect(body).to.have.property('message')
      .and.match(/did not pass/i);
  });

  it("POST with satisfying code should return a 200 with a valid access token", function *() {
    var response = yield request
      .post('/api/question')
      .send({
        code: helpers.passingCodeExpression
      })
      .expect(200)
      .end();

    var body = response.body;
    expect(body).to.have.property('access_token');
    expect(jws.verify(body.access_token, process.env.JWT_SECRET)).to.be.true;
  });
});
