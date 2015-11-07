/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');

import XAxis = require('./XAxis');
import YAxis = require('./YAxis');
import LineSeries = require('./LineSeries');
import Cursor = require('./Cursor');

class Chart extends React.Component<Chart.Props, Chart.State> {
	
	private xScale = d3.time.scale<Date, number>();
	private yScale = d3.scale.linear();
	
	private get width() {
		return this.props.containerWidth -
			this.props.margin.left -
			this.props.margin.right;
	}
	
	private get height() {
		return this.props.containerHeight -
			this.props.margin.top -
			this.props.margin.bottom;
	}
	
	constructor(props) {
		super(props);
		
		this.xScale
			.range([0, this.width] as any) // range() wants Dates which is wrong
			.domain([
				this.props.data[0].dateTime,
				this.props.data[this.props.data.length - 1].dateTime
			])
			.nice();
	}
	
	private handleZoom = () => this.forceUpdate(); 
	
	render() {
		var { data, containerWidth, containerHeight, margin } = this.props,
			width = this.width, // To avoid multiple substracts
			height = this.height, // To avoid multiple substracts
		
			domain = this.xScale.domain(),
			i = Quote.bisect(data, domain[0], 1),
			j = Quote.bisect(data, domain[1], i + 1),
			extent = d3.extent(data.slice(i, j + 1), d => d.close);
		
		this.yScale.range([height, 0]);
		
		if (extent[0] != extent[1]) {
			this.yScale.domain(extent).nice();
		}
		
		return (
			<svg width={containerWidth} height={containerHeight}>
				<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
					{React.createElement('clipPath', {id: 'clip'},
						<rect width={width} height={height} />
					) /* TSX doesn't know clipPath element */}
					<XAxis height={height} scale={this.xScale} />
					<YAxis width={width} scale={this.yScale} />
					<LineSeries
						data={data}
						xScale={this.xScale}
						yScale={this.yScale}
						clipPath='url(#clip)' />
					<Cursor
						data={data}
						width={width}
						height={height}
						xScale={this.xScale}
						yScale={this.yScale}
						onZoom={this.handleZoom} />
				</g>
			</svg>
		);
	}
}

module Chart {
	export interface Props {
		data: Quote[];
		containerWidth?: number;
		containerHeight?: number;
		margin?: { top: number; right: number; bottom: number; left: number; };
	}
	
	export var defaultProps: Props = {
		data: undefined,
		containerWidth: 800,
		containerHeight: 600,
		margin: { top: 20, right: 50, bottom: 30, left: 20 }
	}
	
	export interface State {
	}
}

export = Chart;