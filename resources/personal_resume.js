'use strict';

var assert = require('assert');
var request = require('request');
var secure = require('../lib/secure');

assert(process.env.GOOGLE_DOCS_RESUME_BASE_EXPORT_URL, 'Missing required environment variable: GOOGLE_DOCS_RESUME_BASE_EXPORT_URL');
assert(process.env.JWT_SECRET, 'Missing required environment variable: JWT_SECRET');

var FORMATS = {
  pdf: {
    ext: 'pdf',
    contentType: 'application/pdf',
    description: 'PDF Document'
  },
  html: {
    ext: 'html',
    contentType: 'text/html',
    description: 'HTML Document'
  },
  doc: {
    ext: 'docx',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Word Document'
  },
  text: {
    ext: 'txt',
    contentType: 'text/plain',
    description: 'Text File'
  }
};

module.exports = function (app) {
  app.get('/api/personal_resume', function *() {
    secure(this);

    var format;
    // default to PDF format
    switch (this.accepts(FORMATS.pdf.contentType, FORMATS.html.contentType, FORMATS.doc.contentType, FORMATS.text.contentType)) {
      case FORMATS.pdf.contentType:
        format = FORMATS.pdf;
        break;
      case FORMATS.html.contentType:
        format = FORMATS.html;
        break;
      case FORMATS.doc.contentType:
        format = FORMATS.doc;
        break;
      case FORMATS.text.contentType:
        format = FORMATS.text;
        break;
      default:
        format = FORMATS.pdf;
    }

    this.response.type = format.contentType;
    var exportUrl = process.env.GOOGLE_DOCS_RESUME_BASE_EXPORT_URL + '&format=' + format.ext;
    this.body = request.get(exportUrl);
  });

  app.get('/api/personal_resume/formats', function *() {
    this.body = FORMATS;
  });
};
