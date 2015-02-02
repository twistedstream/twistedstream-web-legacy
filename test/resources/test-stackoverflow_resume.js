/* global describe, it */
/* jshint expr: true */
'use strict';

var expect = require('chai').expect;
require('co-mocha');
var helpers = require('../helpers');

var app = require('../../app');
var request = require('co-supertest').agent(app.callback());

describe("API StackOverflow Resume (/stackoverflow_resume) resource", function () {
  describe("GET", function () {
    it("should not allow an unauthorized request", function *() {
      var response = yield request
        .get('/api/stackoverflow_resume')
        .expect(401)
        .end();

      var body = response.body;
      expect(body).to.have.property('message')
        .and.match(/missing Authorization request header/i);
    });

    it("should return a 302 with a Location header containing the StackOverflow resume URL", function *() {
      yield request
        .get('/api/stackoverflow_resume')
        .set('Authorization', 'Bearer ' + helpers.createAccessToken())
        .expect(302)
        .expect('Location', process.env.STACK_OVERFLOW_CAREERS_URL)
        .end();
    });
  });
});
