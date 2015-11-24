/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MonitoringData = require('../../../documents/MonitoringData');

import MonitoringStore = require('../stores/MonitoringStore');

import QuotesChart = require('./QuotesChart');
import XAxis = require('./XAxis');

class Chart extends React.Component<{}, Chart.State> {
	
	private static margin = { top: 20, right: 60, bottom: 30, left: 20 };
	
	private svg: SVGElement;
	private xScale = d3.time.scale<Date, number>();
	
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
		this.onChange();
	}
	
	componentWillUnmount() {
		MonitoringStore.removeChangeListener(this.onChange);
		window.removeEventListener('resize', this.onChange);
	}
	
	render() {
		var content: JSX.Element;
		
		if (this.state.monitoringData) {
			
			var margin = Chart.margin,
				width = this.state.width - margin.left - margin.right,
				height = this.state.height - margin.top - margin.bottom,
				dividerY = height / 2;
			
			content = (
				<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
					<QuotesChart
						quotes={this.state.monitoringData.quotes}
						gains={this.state.monitoringData.gains}
						width={width}
						height={dividerY}
						xScale={this.xScale} />
					<g transform={'translate(0, ' + dividerY + ')'}>
					</g>
					<XAxis
						monitoringData={this.state.monitoringData}
						resetXDomain={this.state.resetXDomain}
						width={width}
						height={height}
						scale={this.xScale} />
				</g>
			);
		}
		
		return (
			<svg ref={ref => this.svg = ref}>{content}</svg>
		);
	}
	
	private onChange = () => this.setState(this.chartState);
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