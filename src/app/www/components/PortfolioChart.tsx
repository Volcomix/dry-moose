/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Portfolio = require('../../../documents/Portfolio');

import Margin = require('./common/Margin');

import Chart = require('./Chart');

class PortfolioChart extends React.Component<Props, State> {
	
	private yScale = d3.scale.linear();
	private static yTickFormat = d3.format(',.2f');
	
	render() {
		var margin = this.props.margin;
		this.updateYScale(this.props.height - margin.top - margin.bottom);
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
				zoom={this.props.zoom} />
		);
	}
	
	private updateYScale(height: number) {
		var bisect = d3.bisector(this.xAccessor).left,
			domain = this.props.xScale.domain(),
			i = bisect(this.props.portfolio, domain[0], 1),
			j = bisect(this.props.portfolio, domain[1], i + 1),
			domainData = this.props.portfolio.slice(i - 1, j + 1),
			extent = d3.extent(domainData, this.yAccessor);
		
		this.yScale.range([height, 0]);
		if (extent[0] != extent[1]) {
			var padding = this.props.yDomainPadding * (extent[1] - extent[0]);
			this.yScale.domain([extent[0] - padding, extent[1] + padding]).nice();
		}
	}
	
	private xAccessor = (d: Portfolio) => d.dateTime;
	private yAccessor = (d: Portfolio) => d.value;
}

module PortfolioChart {
	export interface Props {
		portfolio: Portfolio[];
		width: number;
		height: number;
		margin: Margin;
		xScale: d3.time.Scale<Date, number>;
		zoom: d3.behavior.Zoom<{}>;
		yDomainPadding?: number;
	}
	
	export var defaultProps: Props = {
		portfolio: undefined,
		width: undefined,
		height: undefined,
		margin: undefined,
		xScale: undefined,
		zoom: undefined,
		yDomainPadding: 0.1
	}
	
	export interface State {
	}
}

import Props = PortfolioChart.Props;
import State = PortfolioChart.State;

export = PortfolioChart;