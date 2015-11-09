/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');
import moment = require('moment');

import Quote = require('../../../documents/Quote');

import MonitoringActions = require('../actions/MonitoringActions');
import MonitoringStore = require('../stores/MonitoringStore');
import WindowStore = require('../stores/WindowStore');

import XAxis = require('./XAxis');
import YAxis = require('./YAxis');
import LineSeries = require('./LineSeries');
import Cursor = require('./Cursor');

class Chart extends React.Component<Chart.Props, Chart.State> {
	
	private xScale = d3.time.scale<Date, number>();
	private yScale = d3.scale.linear();
	
	private get stateFromStores(): Chart.State {
		return {
			data: MonitoringStore.quotes,
			width: WindowStore.width,
			height: WindowStore.height
		};
	}
	
	constructor(props) {
		super(props);
		MonitoringActions.getLast();
		this.state = this.stateFromStores;
	}
	
	componentDidMount() {
		MonitoringStore.addChangeListener(this.onChange)
		WindowStore.addChangeListener(this.onChange);
	}
	
	componentWillUnmount() {
		MonitoringStore.removeChangeListener(this.onChange);
		WindowStore.removeChangeListener(this.onChange);
	}
	
	render() {
		if (!this.state.data) return <span>Loading data...</span>;
		
		var margin = this.props.margin,
			contentWidth = this.state.width - margin.left - margin.right,
			contentHeight = this.state.height - margin.top - margin.bottom;
		
		this.updateXScale(contentWidth);
		this.updateYScale(contentHeight);
		
		return (
			<svg width={this.state.width} height={this.state.height}>
				<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
					{React.createElement('clipPath', {id: 'clip'},
						<rect width={contentWidth} height={contentHeight} />
					) /* TSX doesn't know clipPath element */}
					<XAxis height={contentHeight} scale={this.xScale} />
					<YAxis width={contentWidth} scale={this.yScale} />
					<LineSeries
						data={this.state.data}
						xScale={this.xScale}
						yScale={this.yScale}
						clipPath='url(#clip)' />
					<Cursor
						data={this.state.data}
						width={contentWidth}
						height={contentHeight}
						xScale={this.xScale}
						yScale={this.yScale}
						onZoom={this.onZoom} />
				</g>
			</svg>
		);
	}
	
	private updateXScale(width: number) {
		var domain = this.xScale.domain();
		
		this.xScale.range([0, width] as any); // range() wants Dates which is wrong
		
		if (+domain[0] == 0 && +domain[1] == 1) {
			var lastQuote = this.state.data[this.state.data.length - 1];
			this.xScale.domain([
				moment(lastQuote.dateTime).subtract({ hours: 2 }).toDate(),
				lastQuote.dateTime
			]).nice();
		}
	}
	
	private updateYScale(height: number) {
		var domain = this.xScale.domain(),
			i = Quote.bisect(this.state.data, domain[0], 1),
			j = Quote.bisect(this.state.data, domain[1], i + 1),
			extent = d3.extent(this.state.data.slice(i - 1, j + 1), d => d.close);
		
		this.yScale.range([height, 0]);
		if (extent[0] != extent[1]) {
			this.yScale.domain(extent).nice();
		}
	}
	
	private onZoom = () => setTimeout(() => {
		var data = this.state.data,
			domain = this.xScale.domain();
		
		if (domain[0]  < data[0].dateTime) {
			MonitoringActions.get(domain[0]);
		} else if (domain[1] > data[data.length - 1].dateTime) {
			MonitoringActions.get(domain[1]);
		}
		
		this.forceUpdate()
	}, 0); // Force wait UI refresh (improve UI performance)
	
	private onChange = () => this.setState(this.stateFromStores);
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