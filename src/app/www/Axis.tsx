/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');

class Axis extends React.Component<Axis.Props, Axis.State> {
	
	private axis: d3.svg.Axis;
	
	constructor(props) {
		super(props);
		
		this.axis = d3.svg.axis()
			.scale(this.props.scale)
			.tickFormat(this.props.tickFormat)
			.orient(this.props.orientation)
	}
	
	render() {
		this.axis.tickSize(this.props.innerTickSize, this.props.outerTickSize);
		return (
			<g
				className={this.props.className + ' axis'}
				transform={'translate(' +
					this.props.translateX + ', ' +
					this.props.translateY +
				')'}
				ref={(ref: any) => d3.select(ref).call(this.axis)} />
		);
	}
}

module Axis {
	export interface Props {
		className?: string;
		scale: any;
		tickFormat: (t: any) => string;
		orientation: string;
		innerTickSize?: number;
		outerTickSize?: number;
		translateX?: number;
		translateY?: number;
	}
	
	export var defaultProps = {
		innerTickSize: 0,
		outerTickSize: 0,
		translateX: 0,
		translateY: 0
	}
	
	export interface State {
	}
}

export = Axis;