/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import BinaryOption = require('../../../documents/options/BinaryOption');

import Margin = require('./common/Margin');
import ChartProps = require('./common/ChartProps');

import Chart = require('./Chart');
import TrendingSeries = require('./TrendingSeries');

class QuotesChart extends React.Component<QuotesChart.Props, {}> {
	
	private yScale = d3.scale.linear();
	private static yTickFormat = d3.format(',.5f');
	
	render() {
		var margin = this.props.margin;
		this.updateYScale(this.props.height - margin.top - margin.bottom);
		return (
			<Chart
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
				zoom={this.props.zoom}>
				<TrendingSeries
					data={this.props.options}
					xAccessor={this.xOptionAccessor}
					yAccessor={this.yOptionAccessor}
					directionAccessor={this.optionDirectionAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale} />
			</Chart>
		);
	}
	
	private updateYScale(height: number) {
		var bisect = d3.bisector(this.xQuoteAccessor).left,
			domain = this.props.xScale.domain(),
			i = bisect(this.props.quotes, domain[0], 1),
			j = bisect(this.props.quotes, domain[1], i + 1),
			domainData = this.props.quotes.slice(i - 1, j + 1),
			extent = d3.extent(domainData, this.yQuoteAccessor);
		
		this.yScale.range([height, 0]);
		if (extent[0] != extent[1]) {
			var padding = this.props.yDomainPadding * (extent[1] - extent[0]);
			this.yScale.domain([extent[0] - padding, extent[1] + padding]).nice();
		}
	}
	
	private xQuoteAccessor = (d: Quote) => d.dateTime;
	private yQuoteAccessor = (d: Quote) => d.close;
	
	private xOptionAccessor = (d: BinaryOption) => d.quote.dateTime;
	private yOptionAccessor = (d: BinaryOption) => d.quote.close;
	
	private optionDirectionAccessor = (d: BinaryOption) => {
		switch (d.direction) {
			case BinaryOption.Direction.Call:
				return TrendingSeries.Direction.Up;
			case BinaryOption.Direction.Put:
				return TrendingSeries.Direction.Down;
		}
	}
}

module QuotesChart {
	export interface Props extends ChartProps {
		quotes: Quote[];
		options: BinaryOption[];
	}
	
	export var defaultProps: Props = ChartProps.defaultProps as Props;
}

export = QuotesChart;