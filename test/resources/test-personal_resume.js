/* global describe, it, after */
/* jshint expr: true */
'use strict';

var expect = require('chai').expect;
require('co-mocha');
var nock = require('nock');
var url = require('url');
var fs = require('fs');
var helpers = require('../helpers');

var app = require('../../app');
var request = require('co-supertest').agent(app.callback());

function mockBackendResumeRequest (replyFileName) {
  var responseFilePath = __dirname + '/replies/' + replyFileName;

  var resumeUrl = process.env.PERSONAL_RESUME_PDF_URL;
  var parts = url.parse(resumeUrl);
  var host = parts.protocol + '//' + parts.host;

  return nock(host)
    .get(parts.path)
    .reply(200, function() {
      return fs.createReadStream(responseFilePath);
    });
}

describe("API Personal Resume (/personal_resume) resource", function () {
  after(function () {
    nock.cleanAll();
  });

  describe("GET", function () {
    it("should not allow an unauthorized request", function *() {
      var response = yield request
        .get('/api/personal_resume')
        .expect(401)
        .end();

      expect(response.text).to.match(/missing Authorization request header/i);
    });

    it("with no Accept request header should return a PDF document by default", function *() {
      var scope = mockBackendResumeRequest('dummy-reply.pdf');

      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer ' + helpers.createAccessToken())
        .expect(200)
        .expect('Content-Type', /application\/pdf/)
        .end();

      expect(response.text).to.match(/^%PDF\-/);
      scope.done();
    });

    it("with a default Accept request header should return a PDF document by default", function *() {
      var scope = mockBackendResumeRequest('dummy-reply.pdf');

      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer ' + helpers.createAccessToken())
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', /application\/pdf/)
        .end();

      expect(response.text).to.match(/^%PDF\-/);
      scope.done();
    });

    it("with a PDF Accept request header should return a PDF document", function *() {
      var scope = mockBackendResumeRequest('dummy-reply.pdf');

      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer ' + helpers.createAccessToken())
        .set('Accept', 'application/pdf')
        .expect(200)
        .expect('Content-Type', /application\/pdf/)
        .end();

      expect(response.text).to.match(/^%PDF\-/);
      scope.done();
    });
  });
});
