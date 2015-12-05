/// <reference path="../../../../typings/tsd.d.ts" />

import d3 = require('d3');

export function updateYScale<T>(
	data: T[], 
	xAccessor: (d: T) => Date,
	yAccessor: (d: T) => number,
	xScale: d3.time.Scale<Date, number>,
	yScale: d3.scale.Linear<number, number>,
	height: number,
	yDomainPadding: number
) {
	var bisect = d3.bisector(xAccessor).left,
		domain = xScale.domain(),
		i = bisect(data, domain[0], 1),
		j = bisect(data, domain[1], i + 1),
		domainData = data.slice(i - 1, j + 1),
		extent = d3.extent(domainData, yAccessor);
	
	yScale.range([height, 0]);
	if (extent[0] != extent[1]) {
		var padding = yDomainPadding * (extent[1] - extent[0]);
		yScale.domain([extent[0] - padding, extent[1] + padding]);
	}
}