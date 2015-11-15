/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');

import Margin = require('./common/Margin');

import Chart = require('./Chart');

class QuotesChart extends React.Component<QuotesChart.Props, QuotesChart.State> {
	
	private static yTickFormat = d3.format(',.5f');
	
	render() {
		return (
			<Chart
				title='Euro/U.S. Dollar'
				data={this.props.quotes}
				xAccessor={(d: Quote) => d.dateTime}
				yAccessor={(d: Quote) => d.close}
				width={this.props.width}
				height={this.props.height}
				margin={this.props.margin}
				xScale={this.props.xScale}
				yTickFormat={QuotesChart.yTickFormat}
				zoom={this.props.zoom} />
		);
	}
}

module QuotesChart {
	export interface Props {
		quotes: Quote[];
		width: number;
		height: number;
		margin: Margin;
		xScale: d3.time.Scale<Date, number>;
		zoom: d3.behavior.Zoom<{}>;
	}
	
	export interface State {
	}
}

export = QuotesChart;