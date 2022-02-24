'use strict';

var httpAssert = require('http-assert');
var jwt = require('jsonwebtoken');

assert(process.env.JWT_SECRET, 'Missing required environment variable: JWT_SECRET');

module.exports = function (ctx) {
  var authHeader = ctx.header.authorization;
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
};
