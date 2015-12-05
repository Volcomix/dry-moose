/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Portfolio = require('../../../documents/Portfolio');

import ChartProps = require('./common/ChartProps');

import LineSeries = require('./LineSeries');
import ChartRow = require('./ChartRow');

class PortfolioChart extends React.Component<PortfolioChart.Props, {}> {
	
	private static yTickFormat = d3.format(',.2f');
	private static yDomainPadding = 0.2;
	private static clipPath = 'clipPortfolio';
	
	private yScale = d3.scale.linear();
	
	render() {
		this.updateYScale();
		return (
			<ChartRow
				title='Portfolio'
				y={this.props.y}
				width={this.props.width}
				height={this.props.height}
				yScale={this.yScale}
				zoom={this.props.zoom}
				clipPath={PortfolioChart.clipPath}
				yTickFormat={PortfolioChart.yTickFormat}>
				<LineSeries
					data={this.props.portfolio}
					xAccessor={this.xAccessor}
					yAccessor={this.yAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={PortfolioChart.clipPath} />
			</ChartRow>
		);
	}
	
	private updateYScale() {
		var bisect = d3.bisector(this.xAccessor).left,
			domain = this.props.xScale.domain(),
			i = bisect(this.props.portfolio, domain[0], 1),
			j = bisect(this.props.portfolio, domain[1], i + 1),
			domainData = this.props.portfolio.slice(i - 1, j + 1),
			extent = d3.extent(domainData, this.yAccessor);
		
		this.yScale.range([this.props.height, 0]);
		if (extent[0] != extent[1]) {
			var padding = PortfolioChart.yDomainPadding * (extent[1] - extent[0]);
			this.yScale.domain([extent[0] - padding, extent[1] + padding]);
		}
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