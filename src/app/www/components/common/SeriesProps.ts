import d3 = require('d3');

interface SeriesProps {
	xScale: d3.time.Scale<Date, number>;
	yScale: d3.scale.Linear<number, number>;
	clipPath: string;
}

export = SeriesProps;