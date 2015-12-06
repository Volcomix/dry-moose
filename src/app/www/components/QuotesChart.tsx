/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import Gain = require('../../../documents/Gain');

import ChartProps = require('./common/ChartProps');
import ScaleUtils = require('../utils/ScaleUtils');

import ChartRow = require('./ChartRow');
import LineSeries = require('./LineSeries');
import GainSeries = require('./GainSeries');

class QuotesChart extends React.Component<QuotesChart.Props, {}> {
	
	private static yTickFormat = d3.format(',.5f');
	private static yDomainPadding = 0.1;
	private static clipPath = 'clipQuotes';
	
	private yScale = d3.scale.linear();
	
	render() {
		ScaleUtils.updateYScale<Quote>(
			this.props.quotes,
			this.xQuoteAccessor,
			this.yQuoteAccessor,
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
					data={this.props.quotes}
					xAccessor={this.xQuoteAccessor}
					yAccessor={this.yQuoteAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={QuotesChart.clipPath} />
				<GainSeries
					gains={this.props.gains}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={QuotesChart.clipPath} />
			</ChartRow>
		);
	}
	
	private xQuoteAccessor = (d: Quote) => d.dateTime;
	private yQuoteAccessor = (d: Quote) => d.close;
}

module QuotesChart {
	export interface Props extends ChartProps {
		quotes: Quote[];
		gains: Gain[];
	}
}

export = QuotesChart;