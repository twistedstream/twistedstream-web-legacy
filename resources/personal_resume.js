'use strict';

var assert = require('assert');
var httpAssert = require('http-assert');
var jwt = require('jsonwebtoken');
var request = require('request');

assert(process.env.GOOGLE_DOCS_RESUME_BASE_EXPORT_URL, 'Missing required environment variable: GOOGLE_DOCS_RESUME_BASE_EXPORT_URL');
assert(process.env.JWT_SECRET, 'Missing required environment variable: JWT_SECRET');

var FORMATS = {
  pdf: {
    ext: 'pdf',
    contentType: 'application/pdf'
  },
  html: {
    ext: 'html',
    contentType: 'text/html'
  },
  doc: {
    ext: 'docx',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  text: {
    ext: 'txt',
    contentType: 'text/plain'
  }
};

module.exports = function (app) {
  app.get('/api/personal_resume', function *() {
    // authorize this request
    var authHeader = this.header.authorization;
    httpAssert(authHeader, 401, 'Missing Authorization request header');

    var match = authHeader.match(/^Bearer (.*)$/);
    httpAssert(match, 401, 'Authorization request header is not formatted correctly');

    var accessToken = match[1];
    var payload;
    try {
      payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    }
    catch (err) {}
    httpAssert(payload, 401, 'Invalid access token');

    // default to PDF, but render in HTML, docx, and text if requested
    var format = FORMATS.pdf;

    // check for Accept header first otherwise this.accepts() will default to HTML
    if (this.request.get('Accept')) {
      switch (this.accepts(FORMATS.html.contentType, FORMATS.doc.contentType, FORMATS.text.contentType)) {
        case FORMATS.html.contentType:
          format = FORMATS.html;
          break;
        case FORMATS.doc.contentType:
          format = FORMATS.doc;
          break;
        case FORMATS.text.contentType:
          format = FORMATS.text;
          break;
      }
    }

    this.response.type = format.contentType;
    var exportUrl = process.env.GOOGLE_DOCS_RESUME_BASE_EXPORT_URL + '&format=' + format.ext;
    this.body = request.get(exportUrl);
  });
};
