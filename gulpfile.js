'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-spawn-mocha');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var bowerFiles = require('main-bower-files');
var wiredep = require('wiredep').stream;
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var gutil = require('gulp-util');

// PATHS

var bases = {
	app: 'public/app/',
	dist: 'public/dist/',
};

var paths = {
	scripts: ['scripts/**/*.js', '!scripts/libs/'],
	styles: ['styles/**/*.css'],
	html: ['index.html', '404.html'],
	images: ['images/**/*.png'],
	markdown: ['md/*.md'],
	extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};

// BACKEND

// jshint
gulp.task('jshint', function() {
	return gulp.src(['**/*.js', '!node_modules/**/*.js', '!' + bases.app + '/**/*.js', '!' + bases.dist + '/**/*.js'])
		.pipe(jshint({node: true}))
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'));
});

// run tests
gulp.task('backend-tests', function() {
	return gulp.src(['test/**/test-*.js'], {read: false})
		.pipe(mocha({
			harmony: true,
			reporter: 'spec',
			ui: 'bdd',
			timeout: 2000,
			env: { }
		}));
});

gulp.task('backend', ['jshint', 'backend-tests']);

// FRONTEND

// delete the dist directory, but only once
var isClean = false;
gulp.task('clean', function (cb) {
	if (isClean) {
		gutil.log('dist has already been cleaned.');
		cb();
	} else {
		var stream = gulp.src(bases.dist)
			.pipe(clean());

		stream.on('end', function () {
			isClean = true;
			gutil.log('dist is clean!');
		});

		return stream;
	}
});

// process frontend scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
	var stream = gulp.src(paths.scripts, {cwd: bases.app})
		// frontend jshint
		.pipe(jshint({
			browser: true,
			jquery: true,
			reporter: 'spec',
			ui: 'bdd'
		}));

	// don't uglify if in dev mode so client-side debugging is easier
	if (!isDev) {
		stream = stream.pipe(uglify());
	}

	return stream
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(bases.dist + 'scripts/'));
});

// minimize images
gulp.task('imagemin', ['clean'], function() {
	var stream = gulp.src(paths.images, {cwd: bases.app});

	// don't minimize images if in dev mode
	if (!isDev) {
		stream = stream.pipe(imagemin());
	}

	return stream
		.pipe(gulp.dest(bases.dist + 'images/'));
});

// copy Bower components
gulp.task('bower', ['clean'], function() {
	return gulp.src(bowerFiles(), { base: bases.app + 'components' })
		.pipe(gulp.dest(bases.dist + 'components'));
});

// copy HTML files and wire dependencies
gulp.task('deps', ['bower'], function() {
	return gulp.src(paths.html, {cwd: bases.app})
		.pipe(wiredep())
		.pipe(gulp.dest(bases.dist));
});

// less the CSS's
gulp.task('less', ['clean'], function(){
	return gulp.src(bases.app + 'styles.less')
		.pipe(less())
		.pipe(gulp.dest(bases.dist + 'styles'));
});

// copy any extras
gulp.task('extras', ['clean'], function() {
	return gulp.src(paths.extras, {cwd: bases.app})
		.pipe(gulp.dest(bases.dist));
});

// run all frontend build tasks
gulp.task('build', ['scripts', 'imagemin', 'less', 'deps', 'extras']);

// run tests
gulp.task('frontend-tests', ['build'], function () {
	return gulp.src(['test/**/test-*.js'], {cwd: bases.app, read: false})
		.pipe(mocha({
			reporter: 'spec',
			ui: 'bdd'
		}));
});

gulp.task('frontend', ['build', 'frontend-tests']);

// ALL TOGETHER NOW
gulp.task('default', ['backend', 'frontend']);

// DEVELOPMENT
var isDev = false;

gulp.task('dev-variables', function () {
	isDev = true;
});

// changes to source should trigger associated build tasks
// which will in turn cause dist to change and the dev web server to reload
gulp.task('watch', ['dev-variables', 'frontend'], function (cb) {
	gulp.watch([bases.app + 'index.html', bases.app + 'components'], ['deps']);
	gulp.watch(bases.app + 'images', ['imagemin']);
	gulp.watch(bases.app + 'scripts', ['scripts']);
	gulp.watch(bases.app + 'styles.less', ['less']);
	gulp.watch(paths.extras.map(function (extra) {
		return bases.app + extra;
	}), ['extras']);

	cb();
});

// start a web server that serves up the backend AND restarts on any changes, including frontend
gulp.task('dev', ['watch'], function () {
	return nodemon({ignore: [bases.app], nodeArgs: '--harmony'});
})
