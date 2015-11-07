/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Quote = require('../../../documents/Quote');

import WindowStore = require('../stores/WindowStore');

import XAxis = require('./XAxis');
import YAxis = require('./YAxis');
import LineSeries = require('./LineSeries');
import Cursor = require('./Cursor');

class Chart extends React.Component<Chart.Props, Chart.State> {
	
	private xScale = d3.time.scale<Date, number>();
	private yScale = d3.scale.linear();
	
	private get chartState(): Chart.State {
		return {
			width: WindowStore.getWidth(),
			height: WindowStore.getHeight()
		};
	}
	
	constructor(props) {
		super(props);
		
		this.state = this.chartState;
		
		var data = this.props.data;
		this.xScale.domain([data[0].dateTime, data[data.length - 1].dateTime]).nice();
	}
	
	private handleZoom = () => this.forceUpdate();
	private handleResize = () => this.setState(this.chartState);
	
	componentDidMount() {
		WindowStore.addChangeListener(this.handleResize);
	}
	
	componentWillUnmount() {
		WindowStore.removeChangeListener(this.handleResize);
	}
	
	render() {
		var { data, margin } = this.props,
			contentWidth = this.state.width - margin.left - margin.right,
			contentHeight = this.state.height - margin.top - margin.bottom,
		
			domain = this.xScale.domain(),
			i = Quote.bisect(data, domain[0], 1),
			j = Quote.bisect(data, domain[1], i + 1),
			extent = d3.extent(data.slice(i, j + 1), d => d.close);
		
		this.xScale.range([0, contentWidth] as any); // range() wants Dates which is wrong
		this.yScale.range([contentHeight, 0]);
		
		if (extent[0] != extent[1]) {
			this.yScale.domain(extent).nice();
		}
		
		return (
			<svg width={this.state.width} height={this.state.height}>
				<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
					{React.createElement('clipPath', {id: 'clip'},
						<rect width={contentWidth} height={contentHeight} />
					) /* TSX doesn't know clipPath element */}
					<XAxis height={contentHeight} scale={this.xScale} />
					<YAxis width={contentWidth} scale={this.yScale} />
					<LineSeries
						data={data}
						xScale={this.xScale}
						yScale={this.yScale}
						clipPath='url(#clip)' />
					<Cursor
						data={data}
						width={contentWidth}
						height={contentHeight}
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
		margin?: { top: number; right: number; bottom: number; left: number; };
	}
	
	export var defaultProps: Props = {
		data: undefined,
		margin: { top: 20, right: 50, bottom: 30, left: 20 }
	}
	
	export interface State {
		width: number;
		height: number;
	}
}

export = Chart;