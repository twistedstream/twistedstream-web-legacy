'use strict';

var assert = require('assert');
var request = require('request');
var secure = require('../lib/secure');

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
    secure(this);
    
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
