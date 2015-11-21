/// <reference path="../../../../../typings/tsd.d.ts" />

import d3 = require('d3');

interface SeriesProps {
	data: {}[];
	xAccessor: (d: {}) => Date;
	yAccessor: (d: {}) => number;
	xScale: d3.time.Scale<Date, number>;
	yScale: d3.scale.Linear<number, number>;
}

export = SeriesProps;