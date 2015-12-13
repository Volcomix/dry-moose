/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MovingAverage = require('../../../documents/MovingAverage');

import ScaleUtils = require('../utils/ScaleUtils');

import ChartBase = require('./ChartBase');
import ChartRow = require('./ChartRow');
import LineSeries = require('./LineSeries');
import PointSeries = require('./PointSeries');

class MACrossChart extends ChartBase {
	
	private static yTickFormat = d3.format(',.5f');
	private static yDomainPadding = 0.2;
	private static clipPath = 'clipMACross';
	
	private yScale = d3.scale.linear();
	
	render() {
		ScaleUtils.updateYScale<MovingAverage>(
			this.props.monitoringData.maCross.fast,
			this.xMAAccessor,
			this.yMAAccessor,
			this.props.xScale,
			this.yScale,
			this.props.height,
			MACrossChart.yDomainPadding
		);
		return (
			<ChartRow
				title='Moving Average Cross'
				y={this.props.y}
				width={this.props.width}
				height={this.props.height}
				yScale={this.yScale}
				zoom={this.props.zoom}
				clipPath={MACrossChart.clipPath}
				yTickFormat={MACrossChart.yTickFormat}>
				<LineSeries
					className='mdl-color-text--red'
					data={this.props.monitoringData.maCross.fast}
					xAccessor={this.xMAAccessor}
					yAccessor={this.yMAAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACrossChart.clipPath} />
				<LineSeries
					className='mdl-color-text--green'
					data={this.props.monitoringData.maCross.slow}
					xAccessor={this.xMAAccessor}
					yAccessor={this.yMAAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACrossChart.clipPath} />
				<PointSeries
					className='mdl-color-text--indigo'
					icon='shuffle'
					data={this.props.monitoringData.maCross.cross}
					xAccessor={this.xMAAccessor}
					yAccessor={this.yMAAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACrossChart.clipPath} />
			</ChartRow>
		);
	}
	
	private xMAAccessor = (d: MovingAverage) => d.dateTime;
	private yMAAccessor = (d: MovingAverage) => d.value;
}

export = MACrossChart;