/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Portfolio = require('../../../documents/Portfolio');

import ChartProps = require('./common/ChartProps');

import Chart = require('./Chart');

class PortfolioChart extends React.Component<PortfolioChart.Props, {}> {
	
	private static yTickFormat = d3.format(',.2f');
	private static clipPath = 'clipPortfolio';
	
	private yScale = d3.scale.linear();
	
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
				yScale={this.yScale}
				yTickFormat={PortfolioChart.yTickFormat}
				clipPath={PortfolioChart.clipPath}
				zoom={this.props.zoom}
				yDomainPadding={0.2} />
		);
	}
	
	private xAccessor = (d: Portfolio) => d.dateTime;
	private yAccessor = (d: Portfolio) => d.value;
}

module PortfolioChart {
	export interface Props extends ChartProps {
		portfolio: Portfolio[];
	}
}

export = PortfolioChart;