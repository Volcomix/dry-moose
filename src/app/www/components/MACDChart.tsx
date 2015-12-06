/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MACD = require('../../../documents/MACD');

import ChartProps = require('./common/ChartProps');
import ScaleUtils = require('../utils/ScaleUtils');

import LineSeries = require('./LineSeries');
import ChartRow = require('./ChartRow');

class MACDChart extends React.Component<MACDChart.Props, {}> {
	
	private static yTickFormat = d3.format(',.5f');
	private static yDomainPadding = 0.2;
	private static clipPath = 'clipMACD';
	
	private yScale = d3.scale.linear();
	
	render() {
		ScaleUtils.updateYScale<MACD>(
			this.props.macd,
			this.xMACDAccessor,
			this.yMACDAccessor,
			this.props.xScale,
			this.yScale,
			this.props.height,
			MACDChart.yDomainPadding
		);
		return (
			<ChartRow
				title='MACD'
				y={this.props.y}
				width={this.props.width}
				height={this.props.height}
				yScale={this.yScale}
				zoom={this.props.zoom}
				clipPath={MACDChart.clipPath}
				yTickFormat={MACDChart.yTickFormat}>
				<LineSeries
					className='mdl-color-text--blue'
					data={this.props.macd}
					xAccessor={this.xMACDAccessor}
					yAccessor={this.yMACDAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACDChart.clipPath} />
				<LineSeries
					className='mdl-color-text--red'
					data={this.props.macd}
					xAccessor={this.xMACDAccessor}
					yAccessor={this.yMACDSignalAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACDChart.clipPath} />
			</ChartRow>
		);
	}
	
	private xMACDAccessor = (d: MACD) => d.dateTime;
	private yMACDAccessor = (d: MACD) => d.value;
	private yMACDSignalAccessor = (d: MACD) => d.signal;
}

module MACDChart {
	export interface Props extends ChartProps {
		macd: MACD[];
	}
}

export = MACDChart;