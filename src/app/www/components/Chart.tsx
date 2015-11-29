/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MonitoringData = require('../../../documents/MonitoringData');

import MonitoringStore = require('../stores/MonitoringStore');
import MonitoringActions = require('../actions/MonitoringActions');

import XAxis = require('./XAxis');
import QuotesChart = require('./QuotesChart');
import PortfolioChart = require('./PortfolioChart');
import ChartControls = require('./ChartControls');
import Loading = require('./Loading');

class Chart extends React.Component<{}, Chart.State> {
	
	private static margin = { top: 20, right: 60, bottom: 30, left: 20 };
	
	private svg: SVGElement;
	private xScale = d3.time.scale<Date, number>();
	private zoom = d3.behavior.zoom().scaleExtent([0.5, 10]);
	
	private get chartState(): Chart.State {
		var rect = this.svg && this.svg.getBoundingClientRect();
		return {
			monitoringData: MonitoringStore.data,
			resetXDomain: MonitoringStore.resetXDomain,
			width: rect ? rect.width : 0,
			height: rect ? rect.height : 0
		};
	}
	
	constructor(props) {
		super(props);
		this.state = this.chartState;
	}
	
	componentDidMount() {
		MonitoringStore.addChangeListener(this.onChange);
		window.addEventListener('resize', this.onChange);
		this.zoom.on('zoom', this.onZoom);
		this.onChange();
	}
	
	componentWillUnmount() {
		MonitoringStore.removeChangeListener(this.onChange);
		window.removeEventListener('resize', this.onChange);
		this.zoom.on('zoom', null);
	}
	
	private get chart() {
		if (this.state.monitoringData) {
			
			var margin = Chart.margin,
				width = this.state.width - margin.left - margin.right,
				height = this.state.height - margin.top - margin.bottom,
				quotesHeight = Math.round(height * 2 / 3),
				portfolioHeight = height - quotesHeight;
				
			// range() wants Dates which is wrong
			this.xScale.range([0, width] as any);
			
			if (this.state.resetXDomain) {
				this.xScale.domain(this.state.resetXDomain);
				this.zoom.x(this.xScale as any);
			}
			
			return (
				<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
					<XAxis
						height={height}
						scale={this.xScale} />
					<QuotesChart
						quotes={this.state.monitoringData.quotes}
						gains={this.state.monitoringData.gains}
						width={width}
						height={quotesHeight}
						xScale={this.xScale}
						zoom={this.zoom} />
					<g transform={'translate(0, ' + quotesHeight + ')'}>
						<PortfolioChart
							portfolio={this.state.monitoringData.portfolio}
							width={width}
							height={portfolioHeight}
							xScale={this.xScale}
							zoom={this.zoom} />
					</g>
				</g>
			);
		}
	}
	
	private get controls() {
		if (this.state.monitoringData) {
			return <ChartControls />;
		}
	}
	
	private get loading() {
		if (!this.state.monitoringData) {
			return <Loading />;
		}
	}
	
	render() {
		return (
			<div style={{ height: '100%' }}>
				<svg ref={ref => this.svg = ref}>{this.chart}</svg>
				{this.controls}
				{this.loading}
			</div>
		);
	}
	
	private onChange = () => this.setState(this.chartState);
	
	private onZoom = () => {
		var domain = this.xScale.domain();
		if (domain[0]  < this.state.monitoringData.startDate) {
			MonitoringActions.get(domain[0]);
		} else if (domain[1] > this.state.monitoringData.endDate) {
			MonitoringActions.get(domain[1]);
		}
		setTimeout(this.onChange, 0); // Force wait UI refresh
	};
}

module Chart {
	export interface State {
		monitoringData: MonitoringData;
		resetXDomain: Date[];
		width: number;
		height: number;
	}
}

export = Chart;