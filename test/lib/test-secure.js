/* global describe, it, beforeEach */
/* jshint expr: true */
'use strict';

var expect = require('chai').expect;
var helpers = require('../helpers');

var target = require('../../lib/secure');

describe("lib/secure module", function () {
  var ctx = {};

  beforeEach(function () {
    ctx.header = {};
  });

  describe("# (module.export)", function () {
    it("should return a 401 error when no Authorization header", function () {
      var err;
      try {
        target(ctx);
      }
      catch (e) { err = e; }

      expect(err).to.have.property('status', 401);
      expect(err).to.have.property('message')
        .and.match(/missing Authorization request header/i);
    });

    it("should return a 401 error when the Authorization header doesn't contain a Bearer token", function () {
      ctx.header.authorization = 'foo';

      var err;
      try {
        target(ctx);
      }
      catch (e) { err = e; }

      expect(err).to.have.property('status', 401);
      expect(err).to.have.property('message')
        .and.match(/Authorization request header is not formatted correctly/i);
    });

    it("should return a 401 error when the Authorization header contains a bad access token", function () {
      ctx.header.authorization = 'Bearer foo';

      var err;
      try {
        target(ctx);
      }
      catch (e) { err = e; }

      expect(err).to.have.property('status', 401);
      expect(err).to.have.property('message')
        .and.match(/invalid access token/i);
    });

    it("should return a 401 error when the Authorization header contains an expired access token", function () {
      ctx.header.authorization = 'Bearer ' + helpers.createAccessToken(-5);

      var err;
      try {
        target(ctx);
      }
      catch (e) { err = e; }

      expect(err).to.have.property('status', 401);
      expect(err).to.have.property('message')
        .and.match(/invalid access token/i);
    });

    it("should return nothing (success) when the Authorization header contains a valid access token", function () {
      ctx.header.authorization = 'Bearer ' + helpers.createAccessToken();

      var result = target(ctx);

      expect(result).to.be.undefined;
    });
  });
});
