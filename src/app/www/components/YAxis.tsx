/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

class YAxis extends React.Component<YAxis.Props, YAxis.State> {
	
	private axis = d3.svg.axis()
		.tickFormat(d3.format(',.5f'))
		.orient('right');
	
	constructor(props) {
		super(props);
		this.axis.scale(this.props.scale);
	}
	
	render() {
		this.axis.tickSize(-this.props.width, 0);
		return (
			<g
				className='y axis'
				transform={'translate(' + this.props.width + ', 0)'}
				ref={(ref: any) => d3.select(ref).call(this.axis)} />
		);
	}
}

module YAxis {
	export interface Props {
		width: number;
		scale: d3.scale.Linear<number, number>;
	}
	
	export interface State {
	}
}

export = YAxis;