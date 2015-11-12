/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');
import moment = require('moment');

import MonitoringActions = require('../actions/MonitoringActions');

import XAxis = require('./XAxis');
import YAxis = require('./YAxis');
import LineSeries = require('./LineSeries');
import Cursor = require('./Cursor');

class Chart extends React.Component<Chart.Props, Chart.State> {
	
	private yScale = d3.scale.linear();
	
	render() {
		if (!this.props.data) return <span>Loading data...</span>;
		
		var margin = this.props.margin,
			contentWidth = this.props.width - margin.left - margin.right,
			contentHeight = this.props.height - margin.top - margin.bottom;
		
		this.updateXScale(contentWidth);
		this.updateYScale(contentHeight);
		
		return (
			<svg width={this.props.width} height={this.props.height}>
				<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
					{React.createElement('clipPath', {id: 'clip'},
						<rect width={contentWidth} height={contentHeight} />
					) /* TSX doesn't know clipPath element */}
					<XAxis height={contentHeight} scale={this.props.xScale} />
					<YAxis width={contentWidth} scale={this.yScale} />
					<LineSeries
						data={this.props.data}
						xAccessor={this.props.xAccessor}
						yAccessor={this.props.yAccessor}
						xScale={this.props.xScale}
						yScale={this.yScale}
						clipPath='url(#clip)' />
					<Cursor
						data={this.props.data}
						xAccessor={this.props.xAccessor}
						width={contentWidth}
						height={contentHeight}
						xScale={this.props.xScale}
						yScale={this.yScale}
						onZoom={this.onZoom} />
				</g>
			</svg>
		);
	}
	
	private updateXScale(width: number) {
		var domain = this.props.xScale.domain();
		
		this.props.xScale.range([0, width] as any); // range() wants Dates which is wrong
		
		if (+domain[0] == 0 && +domain[1] == 1) {
			var lastDatum = this.props.data[this.props.data.length - 1];
			var endDateTime = this.props.xAccessor(lastDatum);
			var startDateTime = moment(endDateTime).subtract({ hours: 2 }).toDate();
			this.props.xScale.domain([startDateTime, endDateTime]).nice();
		}
	}
	
	private updateYScale(height: number) {
		var bisect = d3.bisector(this.props.xAccessor).left,
			domain = this.props.xScale.domain(),
			i = bisect(this.props.data, domain[0], 1),
			j = bisect(this.props.data, domain[1], i + 1),
			domainData = this.props.data.slice(i - 1, j + 1),
			extent = d3.extent(domainData, this.props.yAccessor);
		
		this.yScale.range([height, 0]);
		if (extent[0] != extent[1]) {
			this.yScale.domain(extent).nice();
		}
	}
	
	private onZoom = () => setTimeout(() => {
		var data = this.props.data,
			domain = this.props.xScale.domain();
		
		if (domain[0]  < this.props.xAccessor(data[0])) {
			MonitoringActions.get(domain[0]);
		} else if (domain[1] > this.props.xAccessor(data[data.length - 1])) {
			MonitoringActions.get(domain[1]);
		}
		
		this.props.onZoom();
	}, 0); // Force wait UI refresh (improve UI performance)
}

module Chart {
	export interface Props {
		data: {}[];
		xAccessor: (d: {}) => Date;
		yAccessor: (d: {}) => number;
		width: number;
		height: number;
		xScale: d3.time.Scale<Date, number>;
		margin?: { top: number; right: number; bottom: number; left: number; };
		onZoom?: Function;
	}
	
	export var defaultProps: Props = {
		data: undefined,
		xAccessor: undefined,
		yAccessor: undefined,
		width: undefined,
		height: undefined,
		xScale: undefined,
		margin: { top: 20, right: 80, bottom: 30, left: 20 }
	}
	
	export interface State {
	}
}

export = Chart;