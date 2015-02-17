'use strict';

var assert = require('assert');
var metric = require('metric-log');

var requestContext;

var requestMetrics = function () {
  assert(requestContext, 'Request metrics context has not been initialized.');

  return requestContext;
};
requestMetrics.initContext = function (data) {
  requestContext = metric.context(data);

  // bolt on thunk profile wrapper
  requestContext.profileThunk = function (thunk, id, obj) {
    // create wrapping Thunk
    return function (callback) {
      var profile = requestContext.profile(id, obj);

      thunk(function (err, response) {
        if (err) {
          profile({err: err});
        } else {
          profile();
        }

        callback(err, response);
      });
    };
  };
};

module.exports = {
  global: function () {
    // use metric.context() in the future if needed
    return metric;
  },

  request: requestMetrics
};
