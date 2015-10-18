/// <reference path="../../../typings/tsd.d.ts" />

import d3 = require('d3');

export function multi() {
	return d3.time.format.multi([
		['.%L', function(d) { return d.getMilliseconds(); }],
		[':%S', function(d) { return d.getSeconds(); }],
		['%H:%M', function(d) { return d.getMinutes(); }],
		['%H:%M', function(d) { return d.getHours(); }],
		['%a %d', function(d) { return d.getDay() && d.getDate() != 1; }],
		['%b %d', function(d) { return d.getDate() != 1; }],
		['%B', function(d) { return d.getMonth(); }],
		['%Y', function() { return true; }]
	]);
}