'use strict';

var uuid = require('node-uuid');
var util = require('util');
var chalk = require('chalk');
var metrics = require('./metrics').request;

module.exports = function (app) {
  app.use(function *(next) {
    // container for custom logging properties that can be used by all request handlers
    var logging = this.logging = {
      request_id: this.get('X-Request-Id') || uuid.v4()
    };

    // set up metric instance that can be used globally
    metrics.initContext({
      request_id: logging.request_id
    });

    // measure request duration
    var durationProfile = metrics().profile('req.duration');

    yield next;

    // record duration
    durationProfile();

    // core logging data in apache format
    var segments = [
      // client IP
      util.format(chalk.magenta('%s'), this.ip),

      // core data
      util.format(
        chalk.green('"%s %s %s/%s" %s %s "%s" "%s"'),
          this.method,
          this.url,
          this.protocol.toUpperCase(),
          this.req.httpVersion,
          this.status,
          (this.length || '-'),
          (this.get('Referer') || '-'),
          (this.get('User-Agent') || '-')),
    ];

    // custom logging properties
    Object.keys(logging).forEach(function (key) {
      segments.push(
        util.format(chalk.cyan('%s='), key) +
        chalk.white(logging[key])
      );
    });

    console.log(segments.join(' '));
  });
};
