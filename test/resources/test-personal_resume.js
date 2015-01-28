/* global describe, it, after */
/* jshint expr: true */
'use strict';

var jwt = require('jsonwebtoken');
var expect = require('chai').expect;
require('co-mocha');
var nock = require('nock');
var url = require('url');
var fs = require('fs');

var app = require('../../app');
var request = require('co-supertest').agent(app.callback());

function createAccessToken (expiresInMinutes) {
  expiresInMinutes = expiresInMinutes || 60;

  return jwt.sign({
    message: 'I got in!'
  },
  process.env.JWT_SECRET, {
    expiresInMinutes: expiresInMinutes,
    subject: 'flynn'
  });
}

function mockBackendResumeRequest (format, replyFileName) {
  var responseFilePath = __dirname + '/replies/' + replyFileName;

  var resumeUrl = process.env.GOOGLE_DOCS_RESUME_BASE_EXPORT_URL + '&format=' + format;
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
    it("with no Authorization header should return a 401", function *() {
      var response = yield request
        .get('/api/personal_resume')
        .expect(401)
        .end();

      var body = response.body;
      expect(body).to.have.property('message')
        .and.match(/missing Authorization request header/i);
    });

    it("with an Authorization header with no Bearer token should return a 401", function *() {
      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'foo')
        .expect(401)
        .end();

      var body = response.body;
      expect(body).to.have.property('message')
        .and.match(/Authorization request header is not formatted correctly/i);
    });

    it("with an Authorization header with a bad access token should return a 401", function *() {
      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer foo')
        .expect(401)
        .end();

      var body = response.body;
      expect(body).to.have.property('message')
        .and.match(/Invalid access token/i);
    });

    it("with an Authorization header with an expired access token should return a 401", function * () {
      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer ' + createAccessToken(-5))
        .expect(401)
        .end();

      var body = response.body;
      expect(body).to.have.property('message')
        .and.match(/Invalid access token/i);
    });

    it("with no Accept request header should return a PDF document by default", function *() {
      var scope = mockBackendResumeRequest('pdf', 'dummy-reply.pdf');

      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer ' + createAccessToken())
        .expect(200)
        .expect('Content-Type', /application\/pdf/)
        .end();

      expect(response.text).to.match(/^%PDF\-/);
      scope.done();
    });

    it("with a PDF Accept request header should return a PDF document", function *() {
      var scope = mockBackendResumeRequest('pdf', 'dummy-reply.pdf');

      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer ' + createAccessToken())
        .set('Accept', 'application/pdf')
        .expect(200)
        .expect('Content-Type', /application\/pdf/)
        .end();

      expect(response.text).to.match(/^%PDF\-/);
      scope.done();
    });

    it("with an HTML Accept request header should return an HTML document", function *() {
      var scope = mockBackendResumeRequest('html', 'dummy-reply.html');

      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer ' + createAccessToken())
        .set('Accept', 'text/html')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .end();

      expect(response.text).to.match(/^<html>/);
      scope.done();
    });

    it("with a doc Accept request header should return a Word document", function *() {
      var scope = mockBackendResumeRequest('docx', 'dummy-reply.docx');

      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer ' + createAccessToken())
        .set('Accept', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        .expect(200)
        .expect('Content-Type', /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/)
        .end();

      expect(response.text).to.match(/^PK/);
      scope.done();
    });

    it("with a text Accept request header should return a text document", function *() {
      var scope = mockBackendResumeRequest('txt', 'dummy-reply.txt');

      var response = yield request
        .get('/api/personal_resume')
        .set('Authorization', 'Bearer ' + createAccessToken())
        .set('Accept', 'text/plain')
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .end();

      expect(response.text).to.match(/Dummy Reply/);
      scope.done();
    });
  });
});
