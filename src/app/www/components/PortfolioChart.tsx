/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Portfolio = require('../../../documents/Portfolio');

import Margin = require('./common/Margin');

import Chart = require('./Chart');

class PortfolioChart
	extends React.Component<PortfolioChart.Props, PortfolioChart.State> {
	
	private static yTickFormat = d3.format(',.2f');
	
	render() {
		return (
			<Chart
				title='Portfolio'
				data={this.props.portfolio}
				xAccessor={(d: Portfolio) => d.dateTime}
				yAccessor={(d: Portfolio) => d.value}
				width={this.props.width}
				height={this.props.height}
				margin={this.props.margin}
				xScale={this.props.xScale}
				yTickFormat={PortfolioChart.yTickFormat}
				zoom={this.props.zoom} />
		);
	}
}

module PortfolioChart {
	export interface Props {
		portfolio: Portfolio[];
		width: number;
		height: number;
		margin: Margin;
		xScale: d3.time.Scale<Date, number>;
		zoom: d3.behavior.Zoom<{}>;
	}
	
	export interface State {
	}
}

export = PortfolioChart;