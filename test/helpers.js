'use strict';

exports.passingCodeExpression =
  "var a = parseInt(dec);\n" +
  "var b = parseInt(hex, 16);\n" +
  "var c = a + b;\n" +
  "return c.toString(2);";
