/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');
import BBand = require('../../../documents/BBand');

import ScaleUtils = require('../utils/ScaleUtils');

import ChartBase = require('./ChartBase');
import ChartRow = require('./ChartRow');
import LineSeries = require('./LineSeries');
import AreaSeries = require('./AreaSeries');
import GainSeries = require('./GainSeries');

class QuotesChart extends ChartBase {
	
	private static yTickFormat = d3.format(',.5f');
	private static yDomainPadding = 0.2;
	private static clipPath = 'clipQuotes';
	
	private yScale = d3.scale.linear();
	
	render() {
		ScaleUtils.updateYScale<Quote>(
			this.props.monitoringData.quotes,
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
				<AreaSeries
					className='mdl-color-text--teal'
					data={this.props.monitoringData.bband}
					xAccessor={this.xBBandAccessor}
					y0Accessor={this.yUpperBandAccessor}
					y1Accessor={this.yLowerBandAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={QuotesChart.clipPath} />
				<LineSeries
					className='mdl-color-text--teal'
					data={this.props.monitoringData.bband}
					xAccessor={this.xBBandAccessor}
					yAccessor={this.yUpperBandAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={QuotesChart.clipPath} />
				<LineSeries
					className='mdl-color-text--brown'
					data={this.props.monitoringData.bband}
					xAccessor={this.xBBandAccessor}
					yAccessor={this.yMiddleBandAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={QuotesChart.clipPath} />
				<LineSeries
					className='mdl-color-text--teal'
					data={this.props.monitoringData.bband}
					xAccessor={this.xBBandAccessor}
					yAccessor={this.yLowerBandAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={QuotesChart.clipPath} />
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
	
	private xBBandAccessor = (d: BBand) => d.dateTime;
	private yUpperBandAccessor = (d: BBand) => d.upper;
	private yMiddleBandAccessor = (d: BBand) => d.middle;
	private yLowerBandAccessor = (d: BBand) => d.lower;
}

export = QuotesChart;