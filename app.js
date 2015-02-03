'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var bodyParser = require('koa-bodyparser');
var router = require('koa-router');
var serve = require('koa-static');

var thisPackage = require('./package');

// setup koa application
var app = koa();
app.name = thisPackage.name;
app.version = thisPackage.version;

// logger
app.use(logger());

// default error catch
app.use(function *(next) {
	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;

		if (this.status < 500) {
			this.body = {
				message: err.message,
				help_link: 'https://twitter.com/twistedstream'
			};
		} else {
			var requestId = this.request.header['request-id'] || 'N/A';

			this.body = {
				message: "What'd you do?",
				help_link: '/img/wyd.png',
				error_id: requestId
			};
			this.app.emit('error', err, this);
		}
	}
});

// body parser
app.use(bodyParser());

// routes
app.use(router(app));
require('./resources/root')(app);
require('./resources/question')(app);
require('./resources/personal_resume')(app);
require('./resources/stackoverflow_resume')(app);
require('./resources/challenge')(app);

// static content
app.use(serve(__dirname + '/public/dist'));

module.exports = app;
