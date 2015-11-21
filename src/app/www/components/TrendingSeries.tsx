/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import SeriesProps = require('./common/SeriesProps');
import ChartConstants = require('../constants/ChartConstants');

class TrendingSeries extends React.Component<TrendingSeries.Props, {}> {
	
	private getTrends = option => {
		var accessor = this.props.directionAccessor,
			direction = TrendingSeries.Direction[accessor(option)].toLowerCase();
		return (
			<g
				key={+this.props.xAccessor(option)}
				className={direction}
				transform={'translate(' +
					this.props.xScale(this.props.xAccessor(option)) + ', ' +
					this.props.yScale(this.props.yAccessor(option)) +
				')'}>
				<circle r={4.5} />
				<text className='material-icons'>{'trending_' + direction}</text>
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
		directionAccessor: (d: {}) => Direction;
	}
	
	export enum Direction { Up, Down }
}

export = TrendingSeries;