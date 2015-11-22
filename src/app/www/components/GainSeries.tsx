/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Gain = require('../../../documents/Gain');
import BinaryOption = require('../../../documents/options/BinaryOption');

class GainSeries extends React.Component<GainSeries.Props, {}> {
	
	private getGains = (gain: Gain) => {
		var direction: string,
			option = gain.option,
			x1 = this.props.xScale(option.quote.dateTime),
			x2 = this.props.xScale(gain.quote.dateTime) - x1,
			y1 = this.props.yScale(option.quote.close),
			y2 = this.props.yScale(gain.quote.close) - y1;
		return (
			<g
				key={+gain.dateTime}
				className={gain.value ? 'win' : 'lose'}
				transform={'translate(' + x1 + ', ' + y1 + ')'}>
				<text className='material-icons'>{this.getDirectionIcon(option)}</text>
				<circle r={4.5} />
				<line className='option' x2={x2} />
				<line className='expiration' x1={x2} x2={x2} y2={y2} />
			</g>
		);
	}
	
	private getDirectionIcon(option: BinaryOption) {
		switch (option.direction) {
			case BinaryOption.Direction.Call:
				return 'trending_up';
			case BinaryOption.Direction.Put:
				return 'trending_down';
		}
	}
	
	render() {
		// TSX doesn't know clipPath attribute
		return React.createElement('g', {
			className: 'gains',
			clipPath: 'url(#' + this.props.clipPath + ')'
		}, this.props.gains.map(this.getGains));
	}
}

module GainSeries {
	export interface Props {
		gains: Gain[];
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
		clipPath: string;
	}
	
	export enum Direction { Up, Down }
}

export = GainSeries;