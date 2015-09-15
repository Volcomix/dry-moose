/// <reference path="typings/tsd.d.ts" />

var gulp = require('gulp');
var tsc = require('gulp-typescript');
var mocha = require('gulp-mocha');
var del = require('del');

var tsProject = tsc.createProject('tsconfig.json');

gulp.task('clean', function () {
	return del('release');
});

gulp.task('build:js', function () {
	return gulp.src(['src/**/*.ts', '!src/test/**'])
		.pipe(tsc(tsProject))
		.js.pipe(gulp.dest('release'));
});

gulp.task('build:test', function () {
	return gulp.src('src/test/**/*.ts')
		.pipe(tsc({ target: 'ES5', module: 'commonjs' }))
		.js.pipe(gulp.dest('release/test'));
});

gulp.task('build', ['clean'], function () {
	return gulp.src('src/**/*.ts')
		.pipe(tsc(tsProject))
		.js.pipe(gulp.dest('release'));
});

gulp.task('test', ['build'], function () {
	return gulp.src('release/test/**/*.js')
		.pipe(mocha());
});