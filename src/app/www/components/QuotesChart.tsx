/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import Gain = require('../../../documents/Gain');

import ScaleUtils = require('../utils/ScaleUtils');

import ChartBase = require('./ChartBase');
import ChartRow = require('./ChartRow');
import LineSeries = require('./LineSeries');
import GainSeries = require('./GainSeries');

class QuotesChart extends ChartBase {
	
	private static yTickFormat = d3.format(',.5f');
	private static yDomainPadding = 0.2;
	private static clipPath = 'clipQuotes';
	
	private yScale = d3.scale.linear();
	
	render() {
		ScaleUtils.updateYScale(
			[
				{
					data: this.props.monitoringData.quotes,
					x: this.xQuoteAccessor,
					y: [this.yQuoteAccessor]
				},
				{
					data: this.props.monitoringData.gains,
					x: (d: Gain) => d.quote.dateTime,
					y: [(d: Gain) => d.option.quote.close]
				}
			],
			this.props.xScale,
			this.yScale,
			this.props.height,
			QuotesChart.yDomainPadding
		);
		return (
			<ChartRow
				title='Euro/U.S. Dollar'
				y={this.props.y}
				width={this.props.width}
				height={this.props.height}
				yScale={this.yScale}
				zoom={this.props.zoom}
				clipPath={QuotesChart.clipPath}
				yTickFormat={QuotesChart.yTickFormat}>
				<LineSeries
					className='mdl-color-text--indigo'
					data={this.props.monitoringData.quotes}
					xAccessor={this.xQuoteAccessor}
					yAccessor={this.yQuoteAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={QuotesChart.clipPath} />
				<GainSeries
					gains={this.props.monitoringData.gains}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={QuotesChart.clipPath} />
			</ChartRow>
		);
	}
	
	private xQuoteAccessor = (d: Quote) => d.dateTime;
	private yQuoteAccessor = (d: Quote) => d.close;
}

export = QuotesChart;