/// <reference path="typings/tsd.d.ts" />

var path = require('path');

var gulp = require('gulp');
var tsc = require('gulp-typescript');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var del = require('del');
var through2 = require('through2');

var tsProject = tsc.createProject('tsconfig.json');

function addon() {
	return through2.obj(function (chunk, enc, callback) {
		chunk.contents = new Buffer(
			chunk.contents.toString().replace(
				/require\s*\(\s*['"]ta-lib['"]\s*\)/g,
				'require("' + path.relative(chunk.relative, './build/Release/ta-lib')
				.split(path.sep).join(path.posix.sep) + '")'
			)
		);

		this.push(chunk);
		callback();
	})
}

gulp.task('clean', function () {
	return del('release');
});

gulp.task('build:src', function () {
	return gulp.src(['src/**/*.ts', '!src/test/**', 'addon/**/*.d.ts'])
		.pipe(tsc(tsProject))
		.js.pipe(addon())
		.pipe(gulp.dest('release'));
});

gulp.task('build:test', function () {
	return gulp.src(['src/test/**/*.ts', 'addon/**/*.d.ts'])
		.pipe(tsc({ target: 'ES5', module: 'commonjs' }))
		.js.pipe(addon())
		.pipe(gulp.dest('release/test'));
});

gulp.task('build', ['clean'], function () {
	return gulp.src(['src/**/*.ts', 'addon/**/*.d.ts'])
		.pipe(tsc(tsProject))
		.js.pipe(addon())
		.pipe(gulp.dest('release'));
});

gulp.task('test', ['build'], function () {
	return gulp.src('release/test/**/*.js')
		.pipe(mocha({ timeout: 10000 }));
});

gulp.task('watch', function () {
	gulp.watch('src/**/*.ts', ['build:src']);
});

gulp.task('nodemon', ['build:src', 'watch'], function () {
	nodemon({
		script: 'release/app/App.js',
		watch: ['release/app/App.js']
	});
});