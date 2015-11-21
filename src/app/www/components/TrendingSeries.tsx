/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

class TrendingSeries extends React.Component<Props, State> {
	
	private getTrends = option => {
		var accessor = this.props.directionAccessor,
			direction = TrendingSeries.Direction[accessor(option)].toLowerCase();
		return (
			<text
				key={+this.props.xAccessor(option)}
				className={'material-icons ' + direction}
				transform={'translate(' +
					this.props.xScale(this.props.xAccessor(option)) + ', ' +
					this.props.yScale(this.props.yAccessor(option)) +
				')'}>
				{'trending_' + direction}
			</text>
		);
	}
	
	render() {
		return React.createElement('g', {
			className: 'trending',
			clipPath: this.props.clipPath
		}, this.props.data.map(this.getTrends)); // TSX doesn't know clipPath attribute
	}
}

module TrendingSeries {
	export interface Props {
		data: {}[];
		xAccessor: (d: {}) => Date;
		yAccessor: (d: {}) => number;
		directionAccessor: (d: {}) => Direction;
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
		clipPath?: string;
	}
	
	export interface State {
	}
	
	export enum Direction { Up, Down }
}

import Props = TrendingSeries.Props;
import State = TrendingSeries.State;

export = TrendingSeries;