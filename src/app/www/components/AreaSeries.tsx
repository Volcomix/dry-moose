/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import SeriesProps = require('./common/SeriesProps');

class AreaSeries extends React.Component<AreaSeries.Props, {}> {
	
	private area = d3.svg.area<{}>();
	
	render() {
		this.area
			.x(d => this.props.xScale(this.props.xAccessor(d)))
			.y0(d => this.props.yScale(this.props.y0Accessor(d)))
			.y1(d => this.props.yScale(this.props.y1Accessor(d)));
		return (
			<path
				className={'area ' + this.props.className}
				d={this.area(this.props.data)}
				clipPath={'url(#' + this.props.clipPath + ')'} />
		);
	}
}

module AreaSeries {
	export interface Props extends SeriesProps {
		className: string;
		data: {}[];
		xAccessor: (d: {}) => Date;
		y0Accessor: (d: {}) => number;
		y1Accessor: (d: {}) => number;
	}
}

export = AreaSeries;