/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');

import Margin = require('./Margin');

class Chart extends React.Component<Chart.Props, Chart.State> {
	render() {
		var {width, height, margin} = this.props;
		return (
			<svg width={width} height={height}>
				<g transform={'translate(' + margin.left  + ', ' + margin.top + ')'}>
					{this.props.children}
				</g>
			</svg>
		);
	}
}

module Chart {
	export interface Props {
		width: number;
		height: number;
		margin?: Margin
		children?: React.ReactElement<any>[]
	}
	
	export var defaultProps = {
		margin: {
			top: 20,
			right: 50,
			bottom: 30,
			left: 20
		}
	}
  
	export interface State {
	}
}

export = Chart;