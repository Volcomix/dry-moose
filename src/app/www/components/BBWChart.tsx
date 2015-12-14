/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import BBand = require('../../../documents/BBand');

import ScaleUtils = require('../utils/ScaleUtils');

import ChartBase = require('./ChartBase');
import ChartRow = require('./ChartRow');
import LineSeries = require('./LineSeries');

class BBWChart extends ChartBase {
	
	private static yTickFormat = d3.format(',.5f');
	private static yDomainPadding = 0.2;
	private static clipPath = 'clipBBW';
	
	private yScale = d3.scale.linear();
	
	render() {
		ScaleUtils.updateYScale(
			[
				{
					data: this.props.monitoringData.bband,
					x: this.xBBandAccessor,
					y: [this.yBandWidthAccessor]
				}
			],
			this.props.xScale,
			this.yScale,
			this.props.height,
			BBWChart.yDomainPadding
		);
		return (
			<ChartRow
				title='Bollinger Bands Width'
				y={this.props.y}
				width={this.props.width}
				height={this.props.height}
				yScale={this.yScale}
				zoom={this.props.zoom}
				clipPath={BBWChart.clipPath}
				yTickFormat={BBWChart.yTickFormat}>
				<LineSeries
					className='mdl-color-text--teal'
					data={this.props.monitoringData.bband}
					xAccessor={this.xBBandAccessor}
					yAccessor={this.yBandWidthAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={BBWChart.clipPath} />
			</ChartRow>
		);
	}
	
	private xBBandAccessor = (d: BBand) => d.dateTime;
	private yBandWidthAccessor = (d: BBand) => d.width;
}

export = BBWChart;