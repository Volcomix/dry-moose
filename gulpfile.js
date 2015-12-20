/// <reference path="typings/tsd.d.ts" />

var path = require('path');

var gulp = require('gulp');
var tsc = require('gulp-typescript');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var watchify = require('watchify');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var del = require('del');
var through2 = require('through2');
var mongodb = require('mongodb');

var tsProject = tsc.createProject('tsconfig.json');

var opts = assign({}, watchify.args, {
  entries: ['release/app/www/Index.js'],
  debug: true
});
var b = watchify(browserify(opts));
b.on('update', bundle);
b.on('log', gutil.log);

function addon() {
	return through2.obj(function(chunk, enc, callback) {
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

function bundle() {
	return b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('release/app/www'));
}

gulp.task('clean', function() {
	return del('release');
});

gulp.task('build:src', function() {
	return gulp.src(['src/**/*.ts?(x)', '!src/test/**', 'addon/**/*.d.ts'])
		.pipe(tsc(tsProject))
		.js.pipe(addon())
		.pipe(gulp.dest('release'));
});

gulp.task('build:app', function() {
	return gulp.src([
			'src/**/*.ts', '!src/test/**', '!src/app/www/**',
			'addon/**/*.d.ts'
		])
		.pipe(tsc(tsProject))
		.js.pipe(addon())
		.pipe(gulp.dest('release'));
});

gulp.task('build:www', function() {
	return gulp.src(['src/app/www/**/*.ts?(x)', 'src/documents/**/*.ts'])
		.pipe(tsc(tsProject))
		.js.pipe(gulp.dest('release'));
});

gulp.task('build:test', function() {
	return gulp.src(['src/test/**/*.ts', 'addon/**/*.d.ts'])
		.pipe(tsc({ target: 'ES5', module: 'commonjs' }))
		.js.pipe(addon())
		.pipe(gulp.dest('release/test'));
});

gulp.task('build', ['clean'], function() {
	return gulp.src(['src/**/*.ts?(x)', 'addon/**/*.d.ts'])
		.pipe(tsc(tsProject))
		.js.pipe(addon())
		.pipe(gulp.dest('release'));
});

gulp.task('bundle', ['build:src'], bundle);

gulp.task('test', ['build'], function() {
	return gulp.src('release/test/**/*.js')
		.pipe(mocha({ timeout: 10000 }));
});

gulp.task('watch:app', function() {
	gulp.watch(
		['src/**/*.ts', '!src/test/**', '!src/app/www/**', 'addon/**/*.d.ts'],
		['build:app']
	);
});

gulp.task('watch:www', function() {
	gulp.watch(
		['src/app/www/**/*.ts?(x)', 'src/documents/**/*.ts'],
		['build:www']
	);
});

gulp.task('nodemon', ['build:src', 'watch:app'], function(cb) {
	var started = false;
	return nodemon({
		script: 'release/app/App.js',
		watch: ['release/app/App.js']
	})
	.on('start', function() {
		if (!started) {
			started = true;
			cb();
		}
	});
});

gulp.task('browser-sync', ['nodemon', 'watch:www', 'bundle'], function() {
    browserSync.init({
        proxy: 'localhost:8080'
    });
	
	gulp.watch('www/**/*.css', ['browser-sync:css']);
	gulp.watch(['www/**/*.html', 'release/app/www/bundle.js'])
		.on('change', browserSync.reload);
});

gulp.task('browser-sync:css', function() {
	return gulp.src('www/**/*.css')
		.pipe(browserSync.stream());
});

gulp.task('db:clean', function() {
	var db;
	
	function closeDb() {
		return db.close();
	}
	
	return mongodb.MongoClient.connect('mongodb://localhost:27017/dry-moose')
	.then(function(connectedDb) {
		db = connectedDb;
		return Promise.all([
			db.collection('quotes').drop(),
			db.collection('options').drop(),
			db.collection('gains').drop(),
			db.collection('portfolio').drop()
		]);
	})
	.then(closeDb, closeDb);
});

gulp.task('run:db', ['db:clean', 'build'], function() {
	var Supervisor = require('./release/Supervisor'),
		DbCollector = require('./release/collectors/DbCollector'),
		VolcoProcessor = require('./release/processors/VolcoProcessor'),
		ConsoleInvestor = require('./release/investors/ConsoleInvestor'),
		DemoCelebrator = require('./release/celebrators/DemoCelebrator'),
		DemoCapacitor = require('./release/capacitors/DemoCapacitor'),
		processor = new VolcoProcessor(60, 60, {
			fastPeriod: 12, slowPeriod: 26, signalPeriod: 9,
			maxHists: 15, minHistHeight: 0.00005, maxHistHeight: 0.0001,
			minRaisingHists: 2, minHistRaisingFactor: 0.8
		}),
		investor = new ConsoleInvestor(),
		celebrator = new DemoCelebrator(),
		capacitor = new DemoCapacitor(100);
	
	return new Supervisor(
		new DbCollector('eurusd'),
		processor, investor, celebrator, capacitor
	)
	.run();
});