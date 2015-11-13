/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MonitoringActions = require('../actions/MonitoringActions');
import MonitoringStore = require('../stores/MonitoringStore');

import QuotesChart = require('./QuotesChart');
import PortfolioChart = require('./PortfolioChart');

class Charts extends React.Component<Charts.Props, Charts.State> {
	
	private mainContainer: HTMLDivElement;
	private quotesChartContainer: HTMLDivElement;
	private portfolioChartContainer: HTMLDivElement;
	private xScale = d3.time.scale<Date, number>();
	private zoom = d3.behavior.zoom();
	
	constructor(props) {
		super(props);
		this.zoom.scaleExtent(this.props.zoomScaleExtent);
		this.state = {
			mainWidth: undefined,
			quotesChartHeight: undefined,
			portfolioChartHeight: undefined
		};
	}
	
	componentDidMount() {
		window.addEventListener('resize', this.onResize);
		this.onResize();
		this.zoom.on('zoom', this.onZoom);
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
		this.zoom.on('zoom', null);
	}
	
	render() {
		return (
			<div
				style={{ height: '100%' }}
				ref={(ref: any) => this.mainContainer = ref}>
				<div
					style={{ height: '50%' }}
					ref={(ref: any) => this.quotesChartContainer = ref}>
					<QuotesChart
						width={this.state.mainWidth}
						height={this.state.quotesChartHeight}
						xScale={this.xScale}
						zoom={this.zoom} />
				</div>
				<div
					style={{ height: '50%' }}
					ref={(ref: any) => this.portfolioChartContainer = ref}>
					<PortfolioChart
						width={this.state.mainWidth}
						height={this.state.portfolioChartHeight}
						xScale={this.xScale}
						zoom={this.zoom} />
				</div>
			</div>
		);
	}
	
	private onResize = () => this.setState({
		mainWidth: this.mainContainer.offsetWidth,
		quotesChartHeight: this.quotesChartContainer.offsetHeight,
		portfolioChartHeight: this.portfolioChartContainer.offsetHeight
	});
	
	
	private onZoom = () => setTimeout(() => {
		var domain = this.xScale.domain();
		if (domain[0]  < MonitoringStore.startDate) {
			MonitoringActions.get(domain[0]);
		} else if (domain[1] > MonitoringStore.endDate) {
			MonitoringActions.get(domain[1]);
		}
		this.forceUpdate();
	}, 0); // Force wait UI refresh (improve UI performance)
}

module Charts {
	export interface Props {
		zoomScaleExtent?: [number, number];
	}
	
	export var defaultProps: Props = {
		zoomScaleExtent: [0.5, 10]
	}
	
	export interface State {
		mainWidth: number;
		quotesChartHeight: number;
		portfolioChartHeight: number;
	}
}

export = Charts;