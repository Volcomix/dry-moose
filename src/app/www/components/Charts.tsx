/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');
import moment = require('moment');

import Margin = require('./common/Margin');
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
		
	private get chartsState(): Charts.State {
		return {
			loaded: !!MonitoringStore.endDate,
			mainWidth:
				this.mainContainer && this.mainContainer.offsetWidth,
			quotesChartHeight:
				this.quotesChartContainer && this.quotesChartContainer.offsetHeight,
			portfolioChartHeight:
				this.portfolioChartContainer && this.portfolioChartContainer.offsetHeight
		};
	}
	
	constructor(props) {
		super(props);
		this.zoom.scaleExtent(this.props.zoomScaleExtent);
		this.state = this.chartsState;
	}
	
	componentDidMount() {
		MonitoringStore.addChangeListener(this.onChange);
		window.addEventListener('resize', this.onChange);
		this.onChange();
		this.zoom.on('zoom', this.onZoom);
	}
	
	componentWillUnmount() {
		MonitoringStore.removeChangeListener(this.onChange);
		window.removeEventListener('resize', this.onChange);
		this.zoom.on('zoom', null);
	}
	
	render() {
		if (this.state.loaded) {
			this.updateXScale();
		}
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
						margin={this.props.margin}
						xScale={this.xScale}
						zoom={this.zoom} />
				</div>
				<div
					style={{ height: '50%' }}
					ref={(ref: any) => this.portfolioChartContainer = ref}>
					<PortfolioChart
						width={this.state.mainWidth}
						height={this.state.portfolioChartHeight}
						margin={this.props.margin}
						xScale={this.xScale}
						zoom={this.zoom} />
				</div>
			</div>
		);
	}
	
	private updateXScale() {
		var margin = this.props.margin,
			contentWidth = this.state.mainWidth - margin.left - margin.right,
			domain = this.xScale.domain();
		
		this.xScale.range([0, contentWidth] as any); // range() wants Dates which is wrong
		
		if (+domain[0] == 0 && +domain[1] == 1) {
			this.initXDomain();
		}
	}
	
	private initXDomain() {
		var endDateTime = MonitoringStore.endDate,
			startDateTime = moment(endDateTime).subtract({ hours: 2 }).toDate();
		
		this.xScale.domain([startDateTime, endDateTime]).nice();
		this.zoom.x(this.xScale as any)
	}
	
	private onChange = () => this.setState(this.chartsState);
	
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
		margin?: Margin;
		zoomScaleExtent?: [number, number];
	}
	
	export var defaultProps: Props = {
		margin: { top: 20, right: 80, bottom: 30, left: 20 },
		zoomScaleExtent: [0.5, 10]
	}
	
	export interface State {
		loaded: boolean;
		mainWidth: number;
		quotesChartHeight: number;
		portfolioChartHeight: number;
	}
}

export = Charts;