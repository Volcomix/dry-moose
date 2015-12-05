/// <reference path="../../../../../typings/tsd.d.ts" />

import d3 = require('d3');

interface ChartProps {
	y: number;
	width: number;
	height: number;
	xScale: d3.time.Scale<Date, number>;
	zoom: d3.behavior.Zoom<{}>;
}

export = ChartProps;