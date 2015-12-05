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
	private static yDomainPadding = 0.1;
	private static clipPath = 'clipQuotes';
	
	private yScale = d3.scale.linear();
	
	render() {
		this.updateYScale();
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
					className='mdl-color-text--blue'
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
	
	private updateYScale() {
		var bisect = d3.bisector(this.xQuoteAccessor).left,
			domain = this.props.xScale.domain(),
			i = bisect(this.props.quotes, domain[0], 1),
			j = bisect(this.props.quotes, domain[1], i + 1),
			domainData = this.props.quotes.slice(i - 1, j + 1),
			extent = d3.extent(domainData, this.yQuoteAccessor);
		
		this.yScale.range([this.props.height, 0]);
		if (extent[0] != extent[1]) {
			var padding = QuotesChart.yDomainPadding * (extent[1] - extent[0]);
			this.yScale.domain([extent[0] - padding, extent[1] + padding]);
		}
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