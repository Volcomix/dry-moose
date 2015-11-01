/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

class XAxis extends React.Component<XAxis.Props, XAxis.State> {
	
	private axis = d3.svg.axis()
		.tickFormat(d3.time.format.multi([
			['.%L', d => d.getMilliseconds()],
			[':%S', d => d.getSeconds()],
			['%H:%M', d => d.getMinutes()],
			['%H:%M', d => d.getHours()],
			['%a %d', d => d.getDay() && d.getDate() != 1],
			['%b %d', d => d.getDate() != 1],
			['%B', d => d.getMonth()],
			['%Y', d => true]
		]))
		.orient('bottom');
	
	constructor(props) {
		super(props);
		
		this.axis.scale(this.props.scale);
	}
	
	render() {
		this.axis.tickSize(-this.props.height, 0);
		
		return (
			<g
				className='x axis'
				transform={'translate(0, ' + this.props.height + ')'}
				ref={(ref: any) => d3.select(ref).call(this.axis)} />
		);
	}
}

module XAxis {
	export interface Props {
		height: number;
		scale: d3.time.Scale<Date, number>;
	}
	
	export interface State {
	}
}

export = XAxis;