/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import Gain = require('../../../documents/Gain');

import ChartProps = require('./common/ChartProps');

import BaseChart = require('./BaseChart');
import GainSeries = require('./GainSeries');

class QuotesChart extends React.Component<QuotesChart.Props, {}> {
	
	private static yTickFormat = d3.format(',.5f');
	private static clipPath = 'clipQuotes';
	
	private yScale = d3.scale.linear();
	
	render() {
		return (
			<BaseChart
				title='Euro/U.S. Dollar'
				data={this.props.quotes}
				xAccessor={this.xQuoteAccessor}
				yAccessor={this.yQuoteAccessor}
				width={this.props.width}
				height={this.props.height}
				margin={this.props.margin}
				xScale={this.props.xScale}
				yScale={this.yScale}
				yTickFormat={QuotesChart.yTickFormat}
				clipPath={QuotesChart.clipPath}
				zoom={this.props.zoom}>
				<GainSeries
					gains={this.props.gains}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={QuotesChart.clipPath} />
			</BaseChart>
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