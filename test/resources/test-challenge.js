/* global describe, it */
/* jshint expr: true */
'use strict';

var app = require('../../app');
var expect = require('chai').expect;
require('co-mocha');

var request = require('co-supertest').agent(app.callback());

describe("API Challenge (/) resource", function () {
  it("GET should return the expected function code", function *() {
    var response = yield request
      .get('/api/challenge')
      .expect(200)
      .expect('Content-Type', /json/)
      .end();

    var body = response.body;

    expect(body).to.have.property('code');
  });
});
