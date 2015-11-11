/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');

import Chart = require('./Chart');

class QuotesChart extends React.Component<QuotesChart.Props, QuotesChart.State> {
	render() {
		return (
			<Chart width={this.props.width} height={this.props.height} />
		);
	}
}

module QuotesChart {
	export interface Props {
		width: number;
		height: number;
	}
	
	export interface State {
	}
}

export = QuotesChart;