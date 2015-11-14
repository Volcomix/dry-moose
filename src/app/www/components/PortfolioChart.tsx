/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Portfolio = require('../../../documents/Portfolio');

import Margin = require('./common/Margin');
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
		MonitoringStore.addChangeListener(this.onChange);
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
				margin={this.props.margin}
				xScale={this.props.xScale}
				zoom={this.props.zoom} />
		);
	}
	
	private onChange = () => this.setState(this.stateFromStores);
}

module PortfolioChart {
	export interface Props {
		width: number;
		height: number;
		margin: Margin;
		xScale: d3.time.Scale<Date, number>;
		zoom: d3.behavior.Zoom<{}>;
	}
	
	export interface State {
		portfolio: Portfolio[];
	}
}

export = PortfolioChart;