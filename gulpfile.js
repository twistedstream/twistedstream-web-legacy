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

// BACKEND

// jshint
gulp.task('jshint', function () {
	return gulp.src(['**/*.js', '!node_modules/**/*.js', '!' + bases.app + '/**/*.js', '!' + bases.dist + '/**/*.js'])
		.pipe(jshint({node: true}))
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'));
});

// run tests
gulp.task('backend-tests', function () {
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

// delete the dist directory
gulp.task('clean', function() {
	return gulp.src(bases.dist)
		.pipe(clean());
});

// process frontend scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
	return gulp.src(paths.scripts, {cwd: bases.app})
		// frontend jshint
		.pipe(jshint({
			browser: true,
			jquery: true,
			reporter: 'spec',
			ui: 'bdd'
		}))
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest(bases.dist + 'scripts/'));
});

// minimize images
gulp.task('imagemin', ['clean'], function() {
	return gulp.src(paths.images, {cwd: bases.app})
		.pipe(imagemin())
		.pipe(gulp.dest(bases.dist + 'images/'));
});

// non-minified image copy
gulp.task('imagecopy', ['clean'], function() {
	return gulp.src(paths.images, {cwd: bases.app})
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

// run tests
gulp.task('frontend-tests', function () {
	return gulp.src(['test/**/test-*.js'], {cwd: bases.app, read: false})
		.pipe(mocha({
			reporter: 'spec',
			ui: 'bdd'
		}));
});

gulp.task('frontend', ['scripts', 'imagemin', 'less', 'deps', 'extras', 'frontend-tests']);

// ALL TOGETHER NOW
gulp.task('default', ['backend', 'frontend']);
