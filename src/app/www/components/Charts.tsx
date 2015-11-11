/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');

import QuotesChart = require('./QuotesChart');
import PortfolioChart = require('./PortfolioChart');

class Charts extends React.Component<Charts.Props, Charts.State> {
	
	private quotesChartContainer: HTMLDivElement;
	private portfolioChartContainer: HTMLDivElement;
	
	constructor(props) {
		super(props);
		this.state = {
			quotesChartWidth: undefined,
			quotesChartHeight: undefined,
			portfolioChartWidth: undefined,
			portfolioChartHeight: undefined
		};
	}
	
	componentDidMount() {
		window.addEventListener('resize', this.onResize);
		this.onResize();
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
	}
	
	render() {
		return (
			<div style={{ height: '100%' }}>
				<div
					style={{ height: '50%' }}
					ref={(ref: any) => this.quotesChartContainer = ref}>
					<QuotesChart
						width={this.state.quotesChartWidth}
						height={this.state.quotesChartHeight} />
				</div>
				<div
					style={{ height: '50%' }}
					ref={(ref: any) => this.portfolioChartContainer = ref}>
					<PortfolioChart
						width={this.state.portfolioChartWidth}
						height={this.state.portfolioChartHeight} />
				</div>
			</div>
		);
	}
	
	private onResize = () => this.setState({
		quotesChartWidth: this.quotesChartContainer.offsetWidth,
		quotesChartHeight: this.quotesChartContainer.offsetHeight,
		portfolioChartWidth: this.portfolioChartContainer.offsetWidth,
		portfolioChartHeight: this.portfolioChartContainer.offsetHeight
	})
}

module Charts {
	export interface Props {
	}
	
	export interface State {
		quotesChartWidth: number;
		quotesChartHeight: number;
		portfolioChartWidth: number;
		portfolioChartHeight: number;
	}
}

export = Charts;