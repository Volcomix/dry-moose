/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Portfolio = require('../../../documents/Portfolio');

import ChartProps = require('./common/ChartProps');

import LineSeries = require('./LineSeries');
import ChartRow = require('./ChartRow');

class PortfolioChart extends React.Component<PortfolioChart.Props, {}> {
	
	private static yTickFormat = d3.format(',.2f');
	
	render() {
		return (
			<ChartRow
				title='Portfolio'
				clipPath='clipPortfolio'
				yDomainPadding={0.2}
				data={this.props.portfolio}
				xAccessor={this.xPortfolioAccessor}
				yAccessor={this.yPortfolioAccessor}
				yTickFormat={PortfolioChart.yTickFormat}
				{...this.props}>
				<LineSeries
					className='mdl-color-text--orange'
					data={this.props.portfolio}
					xAccessor={this.xPortfolioAccessor}
					yAccessor={this.yPortfolioAccessor} />
			</ChartRow>
		);
	}
	
	private xPortfolioAccessor = (d: Portfolio) => d.dateTime;
	private yPortfolioAccessor = (d: Portfolio) => d.value;
}

module PortfolioChart {
	export interface Props extends ChartProps {
		portfolio: Portfolio[];
	}
}

export = PortfolioChart;