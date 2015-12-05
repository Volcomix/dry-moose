/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import SeriesProps = require('./common/SeriesProps');

class LineSeries extends React.Component<LineSeries.Props, {}> {
	
	private line = d3.svg.line<{}>();
	
	render() {
		this.line
			.x(d => this.props.xScale(this.props.xAccessor(d)))
			.y(d => this.props.yScale(this.props.yAccessor(d)));
		return (
			<path
				className={'line ' + this.props.className}
				d={this.line(this.props.data)}
				clipPath={'url(#' + this.props.clipPath + ')'} />
		);
	}
}

module LineSeries {
	export interface Props extends SeriesProps {
		className: string;
		data: {}[];
		xAccessor: (d: {}) => Date;
		yAccessor: (d: {}) => number;
	}
}

export = LineSeries;