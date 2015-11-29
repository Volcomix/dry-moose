/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

class LineSeries extends React.Component<LineSeries.Props, {}> {
	
	private line = d3.svg.line<{}>();
	
	render() {
		this.line
			.x(d => this.props.xScale(this.props.xAccessor(d)))
			.y(d => this.props.yScale(this.props.yAccessor(d)));
		return React.createElement('path', {
			className: 'line',
			d: this.line(this.props.data),
			clipPath: 'url(#' + this.props.clipPath + ')'
		}); // TSX doesn't know clipPath attribute
	}
}

module LineSeries {
	export interface Props {	
		data: {}[];
		xAccessor: (d: {}) => Date;
		yAccessor: (d: {}) => number;
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
		clipPath: string;
	}
}

export = LineSeries;