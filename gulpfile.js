/// <reference path="typings/tsd.d.ts" />

var path = require('path');

var gulp = require('gulp');
var tsc = require('gulp-typescript');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var del = require('del');
var through2 = require('through2');

var tsProject = tsc.createProject('tsconfig.json');

function addon() {
	return through2.obj(function (chunk, enc, callback) {
		chunk.contents = new Buffer(
			chunk.contents.toString().replace(
				/require\s*\(\s*['"]ta-lib['"]\s*\)/g,
				'require("' +
					path.relative(chunk.relative, './build/Release/ta-lib')
						.split(path.sep).join(path.posix.sep) +
				'")'
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

gulp.task('build:app', function () {
	return gulp.src([
			'src/**/*.ts', '!src/test/**', '!src/app/www/**',
			'addon/**/*.d.ts'
		])
		.pipe(tsc(tsProject))
		.js.pipe(addon())
		.pipe(gulp.dest('release'));
});

gulp.task('build:www', function () {
	return gulp.src('src/app/www/**/*.ts')
		.pipe(tsc(tsProject))
		.js.pipe(gulp.dest('release/app/www'));
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

gulp.task('watch:app', function () {
	gulp.watch(
		['src/**/*.ts', '!src/test/**', '!src/app/www/**', 'addon/**/*.d.ts'],
		['build:app']
	);
});

gulp.task('watch:www', function() {
	gulp.watch('src/app/www/**/*.ts', ['build:www']);
});

gulp.task('nodemon', ['build:src', 'watch:app'], function (cb) {
	var started = false;
	return nodemon({
		script: 'release/app/App.js',
		watch: ['release/app/App.js']
	})
	.on('start', function() {
		if (!started) {
			started = true;
			setTimeout(cb, 500);
		}
	});
});

gulp.task('browser-sync', ['nodemon', 'watch:www'], function() {
    browserSync.init({
        proxy: 'localhost:8080'
    });
	
	gulp.watch('www/**/*.css', ['browser-sync:css']);
	gulp.watch(['www/**/*.html', 'release/app/www/**/*.js'])
		.on('change', browserSync.reload);
});

gulp.task('browser-sync:css', function() {
	return gulp.src('www/**/*.css')
		.pipe(browserSync.stream());
});