'use strict';

var koa = require('koa');
var koaBunyanLogger = require('koa-bunyan-logger');
var bodyParser = require('koa-bodyparser');
var router = require('koa-router');
var serve = require('koa-static');

var thisPackage = require('./package');

// setup koa application
var app = koa();
app.name = thisPackage.name;
app.version = thisPackage.version;

// logger
app.use(koaBunyanLogger());
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.requestLogger());

// body parser
app.use(bodyParser());

// errors
app.on('error', function (err) {
	if (!err.status || err.status >= 500) {
		var msg = err.stack || err.toString();

		console.error();
		console.error(msg.replace(/^/gm, '  '));
		console.error();
	}
});

// routes
app.use(router(app));
require('./resources/root')(app);
require('./resources/answer')(app);
require('./resources/personal_resume')(app);
require('./resources/stackoverflow_resume')(app);
require('./resources/challenge')(app);

// static content
app.use(serve(__dirname + '/public/dist'));

module.exports = app;
