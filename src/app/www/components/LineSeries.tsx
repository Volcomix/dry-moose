/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import SeriesProps = require('./common/SeriesProps');
import ChartConstants = require('../constants/ChartConstants');

class LineSeries extends React.Component<SeriesProps, {}> {
	
	private line = d3.svg.line<{}>();
	
	constructor(props) {
		super(props);
		this.line
			.x(d => this.props.xScale(this.props.xAccessor(d)))
			.y(d => this.props.yScale(this.props.yAccessor(d)));
	}
	
	render() {
		return React.createElement('path', {
			className: 'line',
			d: this.line(this.props.data),
			clipPath: 'url(#' + ChartConstants.clipPath + ')'
		}); // TSX doesn't know clipPath attribute
	}
}

export = LineSeries;