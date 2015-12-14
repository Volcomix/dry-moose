/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Portfolio = require('../../../documents/Portfolio');

import ScaleUtils = require('../utils/ScaleUtils');

import ChartBase = require('./ChartBase');
import ChartRow = require('./ChartRow');
import LineSeries = require('./LineSeries');

class PortfolioChart extends ChartBase {
	
	private static yTickFormat = d3.format(',.2f');
	private static yDomainPadding = 0.2;
	private static clipPath = 'clipPortfolio';
	
	private yScale = d3.scale.linear();
	
	render() {
		ScaleUtils.updateYScale(
			[
				{
					data: this.props.monitoringData.portfolio,
					x: this.xPortfolioAccessor,
					y: [this.yPortfolioAccessor]
				}
			],
			this.props.xScale,
			this.yScale,
			this.props.height,
			PortfolioChart.yDomainPadding
		);
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
					className='mdl-color-text--orange'
					data={this.props.monitoringData.portfolio}
					xAccessor={this.xPortfolioAccessor}
					yAccessor={this.yPortfolioAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={PortfolioChart.clipPath} />
			</ChartRow>
		);
	}
	
	private xPortfolioAccessor = (d: Portfolio) => d.dateTime;
	private yPortfolioAccessor = (d: Portfolio) => d.value;
}

export = PortfolioChart;