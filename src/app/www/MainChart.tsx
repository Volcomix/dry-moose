/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');

import Chart = require('./Chart');

class MainChart extends React.Component<MainChart.Props, MainChart.State> {
	
	private chart: HTMLElement;
	
	private handleResize = () => {
		this.setState({
			width: this.chart.offsetWidth,
			height: this.chart.offsetHeight
		});
	}
	
	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
	
	render() {
		if (!this.state) {
			return (
				<div
					ref={(ref: any) => ref && this.setState({
						width: ref.offsetWidth,
						height: ref.offsetHeight
					})}
					className="chart" />
			);
		}
		
		return (
			<div ref={(ref: any) => this.chart = ref} className="chart">
				<Chart width={this.state.width} height={this.state.height} />
			</div>
		);
	}
}
module MainChart {
	export interface Props {
	}
	
	export interface State {
		width: number;
		height: number;
	}
}

export = MainChart;