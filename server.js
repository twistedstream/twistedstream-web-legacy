'use strict';

var app = require('./app');

var port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log('%s, app version %s. Listening on port: %s', app.name, app.version, port);
});
