import React = require('react');
import d3 = require('d3');

import SeriesProps = require('./common/SeriesProps');

class HistoSeries extends React.Component<HistoSeries.Props, {}> {
	
	private getHisto = d => {
		var x = this.props.xScale(this.props.xAccessor(d));
		return (
			<line
				key={+this.props.xAccessor(d)}
				x1={x} x2={x}
				y1={this.props.yScale(0)}
				y2={this.props.yScale(this.props.yAccessor(d))} />
		);
	}
		
	render() {
		return (
			<g
				className={'histo ' + this.props.className}
				clipPath={'url(#' + this.props.clipPath + ')'}>
				{this.props.data.map(this.getHisto)}
			</g>
		);
	}
}

module HistoSeries {
	export interface Props extends SeriesProps {
		className: string;
		data: {}[];
		xAccessor: (d: {}) => Date;
		yAccessor: (d: {}) => number;
	}
}

export = HistoSeries;