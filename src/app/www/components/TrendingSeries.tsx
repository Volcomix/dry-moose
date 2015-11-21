/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import SeriesProps = require('./common/SeriesProps');
import ChartConstants = require('../constants/ChartConstants');

class TrendingSeries extends React.Component<TrendingSeries.Props, {}> {
	
	private getTrends = option => {
		var accessor = this.props.directionAccessor,
			direction = TrendingSeries.Direction[accessor(option)].toLowerCase(),
			x1 = this.props.xScale(this.props.xAccessor(option)),
			x2 = this.props.xScale(this.props.expirationAccessor(option)),
			y = this.props.yScale(this.props.yAccessor(option));
		return (
			<g
				key={+this.props.xAccessor(option)}
				transform={'translate(' + x1 + ', ' + y + ')'}>
				<text className='material-icons'>{'trending_' + direction}</text>
				<circle r={4.5} />
				<line x2={x2 - x1} />
			</g>
		);
	}
	
	render() {
		return React.createElement('g', {
			className: 'trending',
			clipPath: 'url(#' + ChartConstants.clipPath + ')'
		}, this.props.data.map(this.getTrends)); // TSX doesn't know clipPath attribute
	}
}

module TrendingSeries {
	export interface Props extends SeriesProps {
		expirationAccessor: (d: {}) => Date;
		directionAccessor: (d: {}) => Direction;
	}
	
	export enum Direction { Up, Down }
}

export = TrendingSeries;