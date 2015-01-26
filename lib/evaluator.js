'use strict';

var util = require('util');
var Sandbox = require('sandbox');

var FUNCTION_NAME = 'sillyStupidAddingMachine';
var CALL_TEMPLATE = FUNCTION_NAME + "(%d, '%s');";

exports.FUNCTION_TEMPLATE =
  'function ' + FUNCTION_NAME + '(dec, hex) {\n' +
  '  // dec will be a decimal integer number\n' +
  '  // hex will be a hexadecimal string\n' +
  '  // return the sum of dec and hex, but in binary format\n' +
  '  %s\n' +
  '}\n';

function testCase (func, dec, hex, expectedBin) {
  var expression = func + util.format(CALL_TEMPLATE, dec, hex);

  var sandbox = new Sandbox();
  return new Promise(function (resolve, reject) {
    sandbox.run(expression, function (output) {
      // console.log('>>> output.result = ' + output.result);

      if (output.result === 'TimeoutError') {
        reject('timeout');
      } else {
        var pass = output.result === "'" + expectedBin + "'";
        resolve(pass);
      }
    });
  });
}

exports.test = function (code) {
  // build full function expression
  var func = util.format(exports.FUNCTION_TEMPLATE, code);

  // execute a series of known test cases
  return Promise.all([
    testCase(func, 0, '0', '0'),
    testCase(func, 42, 'AB', '11010101'),
    testCase(func, -100, 'F5', '10010001')
  ]).then(function (results) {
    // all test cases have to pass
    var passed = results.every(function (result) {
      return result;
    });

    return {
      passed: passed,
      reason: !passed ? 'incorrect' : undefined
    };
  }).catch(function (err) {
    return {
      passed: false,
      reason: err
    };
  });
};