/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import SeriesProps = require('./common/SeriesProps');

class PointSeries extends React.Component<PointSeries.Props, {}> {
	
	private getPoint = d => {
		return (
			<text
				className='material-icons'
				key={+this.props.xAccessor(d)}
				x={this.props.xScale(this.props.xAccessor(d))}
				y={this.props.yScale(this.props.yAccessor(d))}>
				{this.props.icon}
			</text>
		);
	}
	
	render() {
		return (
			<g
				className={'point ' + this.props.className}
				clipPath={'url(#' + this.props.clipPath + ')'}>
				{this.props.data.map(this.getPoint)}
			</g>
		);
	}
}

module PointSeries {
	export interface Props extends SeriesProps {
		className: string;
		icon: string;
		data: {}[];
		xAccessor: (d: {}) => Date;
		yAccessor: (d: {}) => number;
	}
}

export = PointSeries;