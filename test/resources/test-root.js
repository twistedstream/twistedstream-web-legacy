/* global describe, it */
/* jshint expr: true */
'use strict';

var app = require('../../app');
var expect = require('chai').expect;
require('co-mocha');

var request = require('co-supertest').agent(app.callback());

describe("API Root (/) resource", function () {
  it("GET should return the expected application info", function *() {
    var response = yield request
      .get('/api')
      .expect(200)
      .expect('Content-Type', /json/)
      .end();

    var body = response.body;

    expect(body).to.have.property('service_name');
    expect(body).to.have.property('app_version');
  });
});
