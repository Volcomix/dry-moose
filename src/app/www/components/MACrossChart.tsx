/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import BBand = require('../../../documents/BBand');
import MovingAverage = require('../../../documents/MovingAverage');

import ScaleUtils = require('../utils/ScaleUtils');

import ChartBase = require('./ChartBase');
import ChartRow = require('./ChartRow');
import LineSeries = require('./LineSeries');
import AreaSeries = require('./AreaSeries');
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
				title='MA Cross & BBands'
				y={this.props.y}
				width={this.props.width}
				height={this.props.height}
				yScale={this.yScale}
				zoom={this.props.zoom}
				clipPath={MACrossChart.clipPath}
				yTickFormat={MACrossChart.yTickFormat}>
				<AreaSeries
					className='mdl-color-text--teal'
					data={this.props.monitoringData.bband}
					xAccessor={this.xBBandAccessor}
					y0Accessor={this.yUpperBandAccessor}
					y1Accessor={this.yLowerBandAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACrossChart.clipPath} />
				<LineSeries
					className='mdl-color-text--teal'
					data={this.props.monitoringData.bband}
					xAccessor={this.xBBandAccessor}
					yAccessor={this.yUpperBandAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACrossChart.clipPath} />
				<LineSeries
					className='mdl-color-text--teal'
					data={this.props.monitoringData.bband}
					xAccessor={this.xBBandAccessor}
					yAccessor={this.yLowerBandAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACrossChart.clipPath} />
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
	
	private xBBandAccessor = (d: BBand) => d.dateTime;
	private yUpperBandAccessor = (d: BBand) => d.upper;
	private yLowerBandAccessor = (d: BBand) => d.lower;
}

export = MACrossChart;