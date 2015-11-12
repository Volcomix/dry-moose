/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Portfolio = require('../../../documents/Portfolio');

import MonitoringStore = require('../stores/MonitoringStore');

import Chart = require('./Chart');

class PortfolioChart
	extends React.Component<PortfolioChart.Props, PortfolioChart.State> {
	
	private get stateFromStores(): PortfolioChart.State {
		return {
			portfolio: MonitoringStore.portfolio
		};
	}
	
	constructor(props) {
		super(props);
		this.state = this.stateFromStores;
	}
	
	componentDidMount() {
		MonitoringStore.addChangeListener(this.onChange)
	}
	
	componentWillUnmount() {
		MonitoringStore.removeChangeListener(this.onChange);
	}
	
	render() {
		return (
			<Chart
				data={this.state.portfolio}
				xAccessor={(d: Portfolio) => d.dateTime}
				yAccessor={(d: Portfolio) => d.value}
				width={this.props.width}
				height={this.props.height}
				xScale={this.props.xScale}
				onZoom={this.props.onZoom} />
		);
	}
	
	private onChange = () => this.setState(this.stateFromStores);
}

module PortfolioChart {
	export interface Props {
		width: number;
		height: number;
		xScale: d3.time.Scale<Date, number>;
		onZoom?: Function;
	}
	
	export interface State {
		portfolio: Portfolio[];
	}
}

export = PortfolioChart;