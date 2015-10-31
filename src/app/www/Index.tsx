/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');
import d3 = require('d3');

class Svg extends React.Component<any, any> {
	render() {
		var { width, height, margin } = this.props;
		return (
			<svg width={width} height={height}>
				<Chart
					width={width - margin.left - margin.right}
					height={height - margin.top - margin.bottom}
					margin={margin} />
			</svg>
		);
	}
	
	static defaultProps = {
		width: 800,
		height: 600,
		margin: { top: 20, right: 50, bottom: 30, left: 20 }
	}
}

class Chart extends React.Component<any, any> {
	render() {
		return (
			<g transform={'translate(' +
					this.props.margin.left + ', ' + 
					this.props.margin.top +
				')'}>
				<XAxis width={this.props.width} height={this.props.height} />
				<YAxis width={this.props.width} height={this.props.height} />
			</g>
		);
	}
}

class XAxis extends React.Component<any, any> {
	
	private scale = d3.time.scale();
	
	private axis = d3.svg.axis()
		.scale(this.scale)
		.tickFormat(d3.time.format.multi([
			['.%L', function(d) { return d.getMilliseconds(); }],
			[':%S', function(d) { return d.getSeconds(); }],
			['%H:%M', function(d) { return d.getMinutes(); }],
			['%H:%M', function(d) { return d.getHours(); }],
			['%a %d', function(d) { return d.getDay() && d.getDate() != 1; }],
			['%b %d', function(d) { return d.getDate() != 1; }],
			['%B', function(d) { return d.getMonth(); }],
			['%Y', function() { return true; }]
		]))
		.orient('bottom');
	
	render() {
		this.axis.tickSize(-this.props.height, 0);
		this.scale.range([0, this.props.width]);
		
		return (
			<g
				className='x axis'
				transform={'translate(0, ' + this.props.height + ')'}
				ref={(ref: any) => d3.select(ref).call(this.axis)} />
		);
	}
}

class YAxis extends React.Component<any, any> {
	
	private scale = d3.scale.linear();
	
	private axis = d3.svg.axis()
		.scale(this.scale)
		.tickFormat(d3.format(',.5f'))
		.orient('right');
	
	render() {
		this.axis.tickSize(-this.props.width, 0);
		this.scale.range([this.props.height, 0]);
		
		return (
			<g
				className='y axis'
				transform={'translate(' + this.props.width + ', 0)'}
				ref={(ref: any) => d3.select(ref).call(this.axis)} />
		);
	}
}

ReactDOM.render(<Svg />, document.getElementById('chart'));