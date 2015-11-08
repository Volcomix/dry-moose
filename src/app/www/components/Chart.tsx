/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');
import moment = require('moment');

import Quote = require('../../../documents/Quote');

import QuotesStore = require('../stores/QuotesStore');
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
			data: QuotesStore.data,
			width: WindowStore.width,
			height: WindowStore.height
		};
	}
	
	constructor(props) {
		super(props);
		this.state = this.chartState;
	}
	
	private onZoom = () => setTimeout(() => this.forceUpdate(), 0); // Force wait UI
	private onChange = () => this.setState(this.chartState);
	
	componentDidMount() {
		QuotesStore.addChangeListener(this.onChange)
		WindowStore.addChangeListener(this.onChange);
	}
	
	componentWillUnmount() {
		QuotesStore.removeChangeListener(this.onChange);
		WindowStore.removeChangeListener(this.onChange);
	}
	
	render() {
		var data = this.state.data;
		
		if (!data || !data.length) return <span>Loading data...</span>;
		
		var margin = this.props.margin,
			contentWidth = this.state.width - margin.left - margin.right,
			contentHeight = this.state.height - margin.top - margin.bottom,
			domain = this.xScale.domain();
		
		this.xScale.range([0, contentWidth] as any); // range() wants Dates which is wrong
		if (+domain[0] == 0 && +domain[1] == 1) {
			var lastQuote = data[data.length - 1];
			this.xScale.domain([
				moment(lastQuote.dateTime).subtract({ hours: 2 }).toDate(),
				lastQuote.dateTime
			]).nice();
			domain = this.xScale.domain();
		}
		
		var i = Quote.bisect(data, domain[0], 1),
			j = Quote.bisect(data, domain[1], i + 1),
			extent = d3.extent(data.slice(i - 1, j + 1), d => d.close);
		
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
						onZoom={this.onZoom} />
				</g>
			</svg>
		);
	}
}

module Chart {
	export interface Props {
		margin?: { top: number; right: number; bottom: number; left: number; };
	}
	
	export var defaultProps: Props = {
		margin: { top: 20, right: 50, bottom: 30, left: 20 }
	}
	
	export interface State {
		data: Quote[];
		width: number;
		height: number;
	}
}

export = Chart;