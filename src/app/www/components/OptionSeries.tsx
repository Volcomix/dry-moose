/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import BinaryOption = require('../../../documents/options/BinaryOption')

class OptionSeries extends React.Component<OptionSeries.Props, {}> {
	
	private getOptions = (option: BinaryOption) => {
		var direction: string,
			x1 = this.props.xScale(option.quote.dateTime),
			x2 = this.props.xScale(option.expiration),
			y = this.props.yScale(option.quote.close);
		return (
			<g
				key={+option.quote.dateTime}
				transform={'translate(' + x1 + ', ' + y + ')'}>
				<text className='material-icons'>{this.getDirectionIcon(option)}</text>
				<circle r={4.5} />
				<line x2={x2 - x1} />
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
			className: 'options',
			clipPath: 'url(#' + this.props.clipPath + ')'
		}, this.props.options.map(this.getOptions));
	}
}

module OptionSeries {
	export interface Props {
		options: BinaryOption[];
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
		clipPath: string;
	}
	
	export enum Direction { Up, Down }
}

export = OptionSeries;