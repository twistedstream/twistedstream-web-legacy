'use strict';

var gulp = require('gulp');
var mocha = require('gulp-spawn-mocha');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var paths = {
	srcTest: ['test/**/test-*.js'],
	src: ['**/*.js', '!node_modules/**/*.js']
};

//
// fail builds if jshint reports an error
gulp.task('jshint', function () {
	return gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'));
});

//
// fail mocha builds for test failures
gulp.task('test', function () {
	return gulp.src(paths.srcTest, {read: false})
		.pipe(mocha({
			harmony: true,
			reporter: 'spec',
			ui: 'bdd',
			timeout: 2000,
			env: { }
		}));
});

//The default task (called when you run `gulp`)
gulp.task('default', ['test', 'jshint']);
