/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import BinaryOption = require('../../../documents/options/BinaryOption');

import ChartProps = require('./common/ChartProps');

import Chart = require('./Chart');
import OptionSeries = require('./OptionSeries');

class QuotesChart extends React.Component<QuotesChart.Props, {}> {
	
	private static yTickFormat = d3.format(',.5f');
	
	private yScale = d3.scale.linear();
	
	render() {
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
				<OptionSeries
					data={this.props.options}
					xAccessor={this.xOptionAccessor}
					yAccessor={this.yOptionAccessor}
					expirationAccessor={this.optionExpirationAccessor}
					directionAccessor={this.optionDirectionAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale} />
			</Chart>
		);
	}
	
	private xQuoteAccessor = (d: Quote) => d.dateTime;
	private yQuoteAccessor = (d: Quote) => d.close;
	
	private xOptionAccessor = (d: BinaryOption) => d.quote.dateTime;
	private yOptionAccessor = (d: BinaryOption) => d.quote.close;
	
	private optionExpirationAccessor = (d: BinaryOption) => d.expiration;
	
	private optionDirectionAccessor = (d: BinaryOption) => {
		switch (d.direction) {
			case BinaryOption.Direction.Call:
				return OptionSeries.Direction.Up;
			case BinaryOption.Direction.Put:
				return OptionSeries.Direction.Down;
		}
	}
}

module QuotesChart {
	export interface Props extends ChartProps {
		quotes: Quote[];
		options: BinaryOption[];
	}
}

export = QuotesChart;