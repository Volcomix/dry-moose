/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import Chart = require('./Chart');
import Axis = require('./Axis');
import LineSeries = require('./LineSeries');
import TimeFormat = require('./TimeFormat');
import Margin = require('./Margin');

class MainChart extends React.Component<MainChart.Props, MainChart.State> {
	
	private chart: HTMLElement;
	
	private xScale = d3.time.scale<number, Date>();
	private yScale = d3.scale.linear();
	
	private xTickFormat = TimeFormat.multi();
	private yTickFormat = d3.format(',.5f');
	
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
					className='chart' />
			);
		}

		var margin = this.props.margin;		
		var innerWidth = this.state.width - margin.left - margin.right;
		var innerHeight = this.state.height - margin.top - margin.bottom;
		
		this.xScale.range([0, innerWidth]);
        this.yScale.range([innerHeight, 0]);
		
		return (
			<div ref={(ref: any) => this.chart = ref} className='chart'>
				<Chart
					width={this.state.width}
					height={this.state.height}
					margin={this.props.margin}>
					<Axis
						className='x'
						scale={this.xScale}
						tickFormat={this.xTickFormat}
						orientation='bottom'
						innerTickSize={-innerHeight}
						translateY={innerHeight} />
					<Axis
						className='y'
						scale={this.yScale}
						tickFormat={this.yTickFormat}
						orientation='right'
						innerTickSize={-innerWidth}
						translateX={innerWidth} />
					<LineSeries />
				</Chart>
			</div>
		);
	}
}

module MainChart {
	export interface Props {
		margin?: Margin
	}
	
	export var defaultProps: Props = {
		margin: {
			top: 20,
			right: 50,
			bottom: 30,
			left: 20
		}
	}
	
	export interface State {
		width: number;
		height: number;
	}
}

export = MainChart;