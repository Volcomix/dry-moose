import React = require('react');
import d3 = require('d3');

import MACD = require('../../../documents/MACD');

import ScaleUtils = require('../utils/ScaleUtils');

import ChartBase = require('./ChartBase');
import ChartRow = require('./ChartRow');
import LineSeries = require('./LineSeries');
import HistoSeries = require('./HistoSeries');

class MACDChart extends ChartBase {
	
	private static yTickFormat = d3.format(',.5f');
	private static yDomainPadding = 0.2;
	private static clipPath = 'clipMACD';
	
	private yScale = d3.scale.linear();
	
	render() {
		ScaleUtils.updateYScale(
			[
				{
					data: this.props.monitoringData.macd,
					x: this.xMACDAccessor,
					y: [
						this.yMACDAccessor,
						this.yMACDSignalAccessor,
						this.yMACDHistAccessor,
						d => 0
					]
				}
			],
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
				<HistoSeries
					className='mdl-color-text--pink'
					data={this.props.monitoringData.macd}
					xAccessor={this.xMACDAccessor}
					yAccessor={this.yMACDHistAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACDChart.clipPath} />
				<LineSeries
					className='mdl-color-text--deep-orange'
					data={this.props.monitoringData.macd}
					xAccessor={this.xMACDAccessor}
					yAccessor={this.yMACDSignalAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACDChart.clipPath} />
				<LineSeries
					className='mdl-color-text--blue'
					data={this.props.monitoringData.macd}
					xAccessor={this.xMACDAccessor}
					yAccessor={this.yMACDAccessor}
					xScale={this.props.xScale}
					yScale={this.yScale}
					clipPath={MACDChart.clipPath} />
			</ChartRow>
		);
	}
	
	private xMACDAccessor = (d: MACD) => d.dateTime;
	private yMACDAccessor = (d: MACD) => d.value;
	private yMACDSignalAccessor = (d: MACD) => d.signal;
	private yMACDHistAccessor = (d: MACD) => d.hist;
}

export = MACDChart;