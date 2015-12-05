/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import Gain = require('../../../documents/Gain');

import ChartProps = require('./common/ChartProps');

import LineSeries = require('./LineSeries');
import GainSeries = require('./GainSeries');
import ChartRow = require('./ChartRow');

class QuotesChart extends React.Component<QuotesChart.Props, {}> {
	
	private static yTickFormat = d3.format(',.5f');
	
	render() {
		return (
			<ChartRow
				title='Euro/U.S. Dollar'
				clipPath='clipQuotes'
				yDomainPadding={0.1}
				data={this.props.quotes}
				xAccessor={this.xQuoteAccessor}
				yAccessor={this.yQuoteAccessor}
				yTickFormat={QuotesChart.yTickFormat}
				{...this.props}>
				<LineSeries
					className='mdl-color-text--blue'
					data={this.props.quotes}
					xAccessor={this.xQuoteAccessor}
					yAccessor={this.yQuoteAccessor} />
				<GainSeries
					gains={this.props.gains} />
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