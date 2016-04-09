import React = require('react');
import d3 = require('d3');

import Gain = require('../../../documents/Gain');
import BinaryOption = require('../../../documents/options/BinaryOption');

import SeriesProps = require('./common/SeriesProps');

class GainSeries extends React.Component<GainSeries.Props, {}> {
	
	private getGain = (gain: Gain) => {
		var direction: string,
			option = gain.option,
			x1 = this.props.xScale(option.quote.dateTime),
			x2 = this.props.xScale(gain.quote.dateTime) - x1,
			y1 = this.props.yScale(option.quote.close),
			y2 = this.props.yScale(gain.quote.close) - y1;
		return (
			<g
				key={+gain.dateTime}
				className={gain.value ? 'mdl-color-text--green' : 'mdl-color-text--red'}
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
		return (
			<g className='gains' clipPath={'url(#' + this.props.clipPath + ')'}>
				{this.props.gains.map(this.getGain)}
			</g>
		);
	}
}

module GainSeries {
	export interface Props extends SeriesProps {
		gains: Gain[];
	}
}

export = GainSeries;