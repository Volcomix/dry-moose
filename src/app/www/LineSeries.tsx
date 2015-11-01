/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../documents/Quote');

class LineSeries extends React.Component<LineSeries.Props, LineSeries.State> {
	
	private line = d3.svg.line<Quote>();
	
	constructor(props) {
		super(props);
		
		this.line
			.x(d => this.props.xScale(d.dateTime))
			.y(d => this.props.yScale(d.close));
	}
	
	render() {
		return (
			<path
				className='line'
				d={this.line(this.props.data)} />
		);
	}
}

module LineSeries {
	export interface Props {
		data: Quote[];
		xScale: d3.time.Scale<Date, number>;
		yScale: d3.scale.Linear<number, number>;
	}
	
	export interface State {
	}
}

export = LineSeries;