'use strict';

var jwt = require('jsonwebtoken');

exports.passingCodeExpression =
  "var a = parseInt(dec);\n" +
  "var b = parseInt(hex, 16);\n" +
  "var c = a + b;\n" +
  "return c.toString(2);";

exports.createAccessToken = function (expiresInMinutes) {
  expiresInMinutes = expiresInMinutes || 60;

  return jwt.sign({
    message: 'I got in!'
  },
  process.env.JWT_SECRET, {
    expiresInMinutes: expiresInMinutes,
    subject: 'flynn'
  });
};
